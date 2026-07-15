import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export let aiModel = null;

if (GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    aiModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  } catch (err) {
    // Silently handle error to prevent app crash
  }
}
