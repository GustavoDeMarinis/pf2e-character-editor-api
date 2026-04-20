import commonPasswords from "./common-passwords.json";

// bcrypt silently truncates at 72 bytes; we cap at 128 chars so users with
// unusually long passwords aren't surprised by silent truncation.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const HAS_DIGIT = /\d/;
// Any character that is not a letter or digit counts as a special character,
// covering Unicode symbols, punctuation, spaces, accented letters, etc.
const HAS_SPECIAL = /[^\p{L}\d]/u;
// Reject ASCII control characters (tabs, newlines, etc.)
const NO_CONTROL_CHARS = /^[^\x00-\x1F\x7F]*$/;

const commonPasswordSet = new Set(commonPasswords.map((p) => p.toLowerCase()));

export const checkInputPasswordFormat = (password: string): boolean => {
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return false;
  }
  if (!NO_CONTROL_CHARS.test(password)) {
    return false;
  }
  if (!HAS_DIGIT.test(password)) {
    return false;
  }
  if (!HAS_SPECIAL.test(password)) {
    return false;
  }
  if (commonPasswordSet.has(password.toLowerCase())) {
    return false;
  }
  return true;
};
