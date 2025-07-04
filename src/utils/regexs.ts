const PASSWORDREGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;

export const checkInputPasswordFormat = (password: string) => {
  return PASSWORDREGEX.test(password);
};
