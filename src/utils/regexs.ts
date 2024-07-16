import { ErrorCode } from "./shared-types";

const PASSWORDREGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export const checkInputPasswordFormat = (password: string) => {
  return PASSWORDREGEX.test(password);
};
