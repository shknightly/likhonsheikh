import type { NextApiRequest, NextApiResponse } from 'next';

import { loadServerEnv } from '@/utils/env';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const env = loadServerEnv();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        postgres: Boolean(env.POSTGRES_URL),
        redis: Boolean(env.REDIS_URL),
        upstashKv: Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN),
        neonProject: env.NEON_PROJECT_ID ?? null
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
}
