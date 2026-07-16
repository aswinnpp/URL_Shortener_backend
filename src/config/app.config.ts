export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  frontendUrl: process.env.RONTEND_URL ?? 'http://localhost:5173',
});
