import { Prisma, Session, User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";
import prisma from "../../integrations/prisma/prisma-client";
import { ErrorCode, ErrorResult } from "../../utils/shared-types";
import { checkInputPasswordFormat } from "../../utils/regexs";
import { UserSearchResult } from "../user/user";
import {
  AuthPayload,
  jwtSignIn,
  jwtSignOut,
  setRefreshTokenCookie,
} from "../../middleware/security/authorization";
import { config } from "../../config";

// Precomputed bcrypt hash used when a user is not found, to prevent timing-based
// user enumeration (bcrypt.compare always runs, equalizing response time).
const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

const INVALID_CREDENTIALS: ErrorResult = {
  code: ErrorCode.Forbidden,
  message: "Invalid credentials",
};

const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const FAILED_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export const userSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  userName: true,
  userEmail: true,
  role: true,
};

type AuthUsingEmailParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userEmail" | "password"
> & { userName?: string };

type AuthUsingUserNameParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userName" | "password"
> & { userEmail?: string };

type SignUpParams = Pick<
  Prisma.UserUncheckedCreateInput,
  "userName" | "userEmail" | "password"
>;

export const signUp = async (
  userToInsert: SignUpParams
): Promise<UserSearchResult | ErrorResult> => {
  if (!checkInputPasswordFormat(userToInsert.password)) {
    return {
      code: ErrorCode.BadRequest,
      message:
        "Password should have at least one special character, one number and be at least 8 character long",
    };
  }
  //TODO VERIFY BY REGEX email & userName
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { userName: userToInsert.userName },
        { userEmail: userToInsert.userEmail },
      ],
    },
  });
  if (user) {
    return {
      code: ErrorCode.DataConflict,
      message: "UserName or email are already used",
    };
  }
  const hashedPassword = await bcrypt.hash(
    userToInsert.password,
    config.LOCAL_SALT_ROUNDS
  );
  const createdUser = await prisma.user.create({
    select: userSelect,
    data: {
      userName: userToInsert.userName,
      userEmail: userToInsert.userEmail,
      role: UserRole.Player,
      password: hashedPassword,
    },
  });

  return createdUser;
};

export const signIn = async (
  req: Request,
  res: Response,
  userToAuthenticate: AuthUsingEmailParams | AuthUsingUserNameParams
): Promise<(Pick<User, "id" | "role"> & { token: string }) | ErrorResult> => {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      role: true,
      password: true,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
    where: {
      OR: [
        { userName: userToAuthenticate.userName },
        { userEmail: userToAuthenticate.userEmail },
      ],
    },
  });

  // Always run bcrypt.compare to prevent timing-based user enumeration
  const isValidPassword = await bcrypt.compare(
    userToAuthenticate.password,
    user?.password ?? DUMMY_HASH
  );

  if (!user || !isValidPassword) {
    if (user) {
      const now = Date.now();
      const isWithinWindow =
        !user.lockedUntil ||
        user.lockedUntil.getTime() - LOCKOUT_DURATION_MS + FAILED_ATTEMPT_WINDOW_MS > now;

      const newAttempts = isWithinWindow ? user.failedLoginAttempts + 1 : 1;
      const lockedUntil =
        newAttempts >= MAX_FAILED_ATTEMPTS
          ? new Date(now + LOCKOUT_DURATION_MS)
          : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: newAttempts, lockedUntil },
      });
    }
    return INVALID_CREDENTIALS;
  }

  // Check lockout — return same message to not reveal lockout state
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return INVALID_CREDENTIALS;
  }

  const rawRefreshToken = crypto.randomBytes(32).toString("hex");
  const refreshHash = await bcrypt.hash(rawRefreshToken, config.LOCAL_SALT_ROUNDS);
  const expiresAt = new Date(
    Date.now() + config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshHash,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt,
    },
  });

  const token = jwtSignIn(res, {
    userId: user.id,
    role: user.role,
    sessionId: session.id,
  });
  setRefreshTokenCookie(res, `${session.id}:${rawRefreshToken}`);

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  const { password, failedLoginAttempts, lockedUntil, ...publicUser } = user;
  return { ...publicUser, token };
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
  if (req.auth?.sessionId) {
    await prisma.session.update({
      where: { id: req.auth.sessionId },
      data: { revokedAt: new Date() },
    });
  }
  jwtSignOut(res);
};

export const refreshSession = async (
  req: Request,
  res: Response
): Promise<{ token: string } | ErrorResult> => {
  const rawCookie: string | undefined = req.cookies.refresh_token;
  if (!rawCookie) {
    return { code: ErrorCode.Unauthorized, message: "Missing refresh token" };
  }

  const colonIndex = rawCookie.indexOf(":");
  if (colonIndex === -1) {
    return { code: ErrorCode.Unauthorized, message: "Invalid refresh token" };
  }
  const sessionId = rawCookie.slice(0, colonIndex);
  const rawToken = rawCookie.slice(colonIndex + 1);

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: { role: true } } },
  });

  if (!session) {
    return { code: ErrorCode.Unauthorized, message: "Invalid refresh token" };
  }

  // Reuse detected: a revoked token is being replayed — revoke entire session family
  if (session.revokedAt !== null) {
    await prisma.session.updateMany({
      where: { userId: session.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    jwtSignOut(res);
    return { code: ErrorCode.Unauthorized, message: "Invalid refresh token" };
  }

  if (session.expiresAt < new Date()) {
    return { code: ErrorCode.Unauthorized, message: "Refresh token expired" };
  }

  const isValid = await bcrypt.compare(rawToken, session.refreshHash);
  if (!isValid) {
    return { code: ErrorCode.Unauthorized, message: "Invalid refresh token" };
  }

  const rawRefreshToken = crypto.randomBytes(32).toString("hex");
  const refreshHash = await bcrypt.hash(rawRefreshToken, config.LOCAL_SALT_ROUNDS);
  const expiresAt = new Date(
    Date.now() + config.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  const [newSession] = await prisma.$transaction([
    prisma.session.create({
      data: {
        userId: session.userId,
        refreshHash,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        expiresAt,
      },
    }),
    prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    }),
  ]);

  const token = jwtSignIn(res, {
    userId: session.userId,
    role: session.user.role,
    sessionId: newSession.id,
  });
  setRefreshTokenCookie(res, `${newSession.id}:${rawRefreshToken}`);

  return { token };
};

export const getSessions = async (
  userId: string
): Promise<Pick<Session, "id" | "userAgent" | "ipAddress" | "createdAt" | "lastUsedAt" | "expiresAt">[]> => {
  return prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
    },
  });
};

export const revokeSession = async (
  sessionId: string,
  requestingUser: AuthPayload
): Promise<void | ErrorResult> => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return { code: ErrorCode.NotFound, message: "Session not found" };
  }

  if (
    session.userId !== requestingUser.userId &&
    requestingUser.role !== UserRole.Admin
  ) {
    return { code: ErrorCode.Forbidden, message: "Forbidden" };
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
};

export const changePassword = async (
  { id }: Prisma.UserWhereUniqueInput,
  currentUser: AuthPayload,
  {
    currentPassword,
    newPassword,
  }: { currentPassword?: string; newPassword: string }
): Promise<void | ErrorResult> => {
  if (!checkInputPasswordFormat(newPassword)) {
    return {
      code: ErrorCode.BadRequest,
      message:
        "Password must have at least one special character, one number and be 8 character long.",
    };
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      password: true,
    },
    where: { id },
  });

  if (!user) {
    return {
      code: ErrorCode.NotFound,
      message: "User Not Found",
    };
  }

  if (currentUser.role !== UserRole.Admin) {
    if (user.id !== currentUser.userId) {
      return {
        code: ErrorCode.Forbidden,
        message: "Forbidden",
      };
    }
    const isValidPassword = await bcrypt.compare(
      currentPassword ?? "",
      user.password
    );

    if (!isValidPassword) {
      return {
        code: ErrorCode.Forbidden,
        message: "Forbidden",
      };
    }
  }

  const hashedPassword = await handlePasswordEncription(newPassword);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  // Revoke all sessions except the current one
  await prisma.session.updateMany({
    where: {
      userId: user.id,
      revokedAt: null,
      id: { not: currentUser.sessionId },
    },
    data: { revokedAt: new Date() },
  });
};

export const handlePasswordEncription = async (
  newPassword: string
): Promise<string> => {
  return await bcrypt.hash(newPassword, config.LOCAL_SALT_ROUNDS);
};
