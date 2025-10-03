import type { NextApiRequest, NextApiResponse } from 'next';

import { loadServerEnv } from '@/utils/env';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const env = loadServerEnv();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: Boolean(env.MONGODB_URI),
        postgres: Boolean(env.DATABASE_URL),
        redis: Boolean(env.REDIS_URL)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
}
