import { z } from 'zod';

const serverEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  POSTGRES_PRISMA_URL: z.string().url(),
  POSTGRES_HOST: z.string().min(1),
  KV_URL: z.string().url(),
  KV_REST_API_URL: z.string().url(),
  KV_REST_API_TOKEN: z.string().min(1),
  KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
  REDIS_URL: z.string().url(),
  NEON_PROJECT_ID: z.string().min(1).optional(),
  POSTGRES_URL_NON_POOLING: z.string().url().optional(),
  POSTGRES_URL_NO_SSL: z.string().url().optional(),
  POSTGRES_USER: z.string().min(1).optional(),
  POSTGRES_PASSWORD: z.string().min(1).optional(),
  POSTGRES_DATABASE: z.string().min(1).optional(),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  PGHOST: z.string().min(1).optional(),
  PGHOST_UNPOOLED: z.string().min(1).optional(),
  PGUSER: z.string().min(1).optional(),
  PGDATABASE: z.string().min(1).optional(),
  PGPASSWORD: z.string().min(1).optional(),
  STACK_SECRET_SERVER_KEY: z.string().min(1).optional(),
  MONGODB_URI: z.string().url().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional()
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional()
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
    const { fieldErrors } = parsed.error.flatten();
    const missingKeys = Object.entries(fieldErrors)
      .filter(([, issues]) => issues && issues.some((issue) => issue.includes('Required')))
      .map(([key]) => key);

    const hint =
      'Vercel Dashboard → Project Settings → Environment Variables (or use `vercel env`) to sync values. ' +
      'স্থানীয় ডেভেলপমেন্টের জন্য `.env.example` দেখে মান কপি করুন।';

    throw new Error(
      `Environment validation failed: ${parsed.error.message}. Missing keys: ${missingKeys.join(', ') || 'none'}. ${hint}`
    );
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
