import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
// Support comma-separated keys for Round-Robin rotation
export const apiKeys = rawKeys ? rawKeys.split(',').map(k => k.trim()).filter(Boolean) : [];

let currentKeyIndex = 0;

export const getAIModel = () => {
  if (apiKeys.length === 0) return null;

  // Round-Robin selection
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

// Fallback static model for compatibility
export const aiModel = apiKeys.length > 0 ? getAIModel() : null;