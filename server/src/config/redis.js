import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
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
