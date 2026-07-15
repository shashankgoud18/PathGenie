import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.REDIS_TOKEN;

export let redis = null;

if (REDIS_URL && REDIS_TOKEN) {
  try {
    redis = new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN,
    });
  } catch (err) {
    // Silently ignore to fall back to postgres
  }
}
