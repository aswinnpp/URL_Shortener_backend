export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/url-shortener',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  },
  refreshToken: {
    expiresInDays: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? '7', 10),
  },
  cookies: {
    accessTokenMaxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE ?? '900000', 10),
    refreshTokenMaxAge: parseInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE ?? '604800000', 10),
  },
  app: {
    url: process.env.APP_URL ?? 'http://localhost:3000',
    frontendUrl: process.env.RONTEND_URL ?? 'http://localhost:5173',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});
