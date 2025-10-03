import { z } from 'zod';

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().url(),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url(),
  PGHOST: z.string().min(1),
  PGHOST_UNPOOLED: z.string().min(1),
  PGUSER: z.string().min(1),
  PGDATABASE: z.string().min(1),
  PGPASSWORD: z.string().min(1),
  POSTGRES_URL: z.string().url(),
  POSTGRES_URL_NON_POOLING: z.string().url(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_URL_NO_SSL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  STACK_SECRET_SERVER_KEY: z.string().min(1),
  KV_URL: z.string().url(),
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
  KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
  REDIS_URL: z.string().url(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1)
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export const loadServerEnv = (): ServerEnv => {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Environment validation failed: ${parsed.error.message}`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
};

export const getClientEnv = (): ClientEnv => {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  });

  if (!parsed.success) {
    throw new Error(`Client environment validation failed: ${parsed.error.message}`);
  }

  return parsed.data;
};
