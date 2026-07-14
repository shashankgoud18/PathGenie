import { Redis } from 'https://esm.sh/@upstash/redis';

const UPSTASH_REDIS_REST_URL = Deno.env.get('UPSTASH_REDIS_REST_URL');
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

export let redis: Redis | null = null;

if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('✅ Connected to Upstash Redis');
  } catch (err) {
    console.error('❌ Failed to initialize Upstash Redis:', err);
  }
} else {
  console.log('⚠️ Upstash Redis credentials not found, using PostgreSQL as fallback');
}

export function getCacheKey(skill: string, level: string, timeCommitment: string, learningStyle?: string, goal?: string, timeline?: string) {
  const cleanSkill = skill.trim().toLowerCase();
  const cleanLevel = level.trim().toLowerCase();
  const cleanTime = timeCommitment.trim().toLowerCase();
  const cleanStyle = (learningStyle || 'mixed').trim().toLowerCase();
  const cleanGoal = (goal || 'general mastery').trim().toLowerCase();
  const cleanTimeline = (timeline || '4').trim().toLowerCase();
  
  return `roadmap:${cleanSkill}:${cleanLevel}:${cleanTime}:${cleanStyle}:${cleanGoal}:${cleanTimeline}`;
}
