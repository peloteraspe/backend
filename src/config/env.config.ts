export const EnvConfiguration = () => ({
  api: {
    environment: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3005', 10) ?? 3000,
  },
});
