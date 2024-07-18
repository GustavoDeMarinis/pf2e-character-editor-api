export const securitySchema = {
  cookieAuth: {
    type: "apiKey",
    in: "cookie",
    name: "access_token",
  },
};
