export const EnvConfiguration = () => ({
  api: {
    environment: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3005', 10) ?? 3000,
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    key: process.env.SUPABASE_KEY ?? '',
  },
});
