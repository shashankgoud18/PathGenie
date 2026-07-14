import { redis, getCacheKey } from './redis.ts';
import { checkAndIncrementRateLimit } from './rate-limit.ts';
import { roadmapSchema } from './types.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

export async function getCachedRoadmap(supabase: any, skill: string, level: string, timeCommitment: string, learningStyle?: string, goal?: string, timeline?: string) {
  const cacheKey = getCacheKey(skill, level, timeCommitment, learningStyle, goal, timeline);
  
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('⚡ Upstash Redis Cache Hit for:', cacheKey);
        return typeof cached === 'string' ? JSON.parse(cached) : cached;
      }
    } catch (e) {
      console.error('❌ Redis read error, falling back to PostgreSQL:', e);
    }
  }

  const { data: cached } = await supabase
    .from('roadmap_cache')
    .select('cached_data, access_count')
    .eq('cache_key', cacheKey)
    .single();

  if (cached) {
    supabase
      .from('roadmap_cache')
      .update({ access_count: (cached.access_count || 0) + 1 })
      .eq('cache_key', cacheKey)
      .then();
    
    console.log('✅ PostgreSQL Cache Hit for:', cacheKey);
    
    if (redis) {
      redis.set(cacheKey, cached.cached_data, { ex: 604800 }).catch(err => console.error('Redis populate error:', err));
    }
    
    return cached.cached_data;
  }

  return null;
}

export async function cacheRoadmap(supabase: any, skill: string, level: string, timeCommitment: string, learningStyle: string, goal: string, timeline: string, data: any) {
  const cacheKey = getCacheKey(skill, level, timeCommitment, learningStyle, goal, timeline);
  
  if (redis) {
    try {
      await redis.set(cacheKey, data, { ex: 604800 });
      console.log('⚡ Cached roadmap in Upstash Redis:', cacheKey);
    } catch (e) {
      console.error('❌ Failed to cache in Redis:', e);
    }
  }
  
  try {
    await supabase
      .from('roadmap_cache')
      .insert({
        skill_name: skill,
        level,
        time_commitment: timeCommitment,
        cache_key: cacheKey,
        cached_data: data
      });
    console.log('✅ Cached roadmap in PostgreSQL:', cacheKey);
  } catch (e) {
    console.log('PostgreSQL Cache insert failed (might already exist):', e.message);
  }
}

export async function generateGeminiRoadmap(supabase: any, prompt: string, userId: string, userTier: string) {
  const isAllowed = await checkAndIncrementRateLimit(supabase, userId, 'gemini', 'generateContent', userTier);
  if (!isAllowed) {
    throw new Error('Monthly roadmap generation limit reached. Upgrade to Pro for unlimited roadmaps!');
  }

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  console.log('🤖 Calling Gemini API...');
  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 8192 }
    }),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    throw new Error(`AI service error: ${geminiResponse.status}: ${errorText}`);
  }

  const geminiData = await geminiResponse.json();
  const candidate = geminiData.candidates?.[0];
  
  if (candidate?.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
    throw new Error(`AI generation blocked/failed (Reason: ${candidate.finishReason}). Please try a different skill or goal description.`);
  }

  let generatedContent = candidate?.content?.parts?.[0]?.text || '';
  let cleanContent = generatedContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(cleanContent);
  } catch (e) {
    console.log('⚠️ Standard JSON parse failed, trying regex extraction...');
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsedJson = JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error('💥 Regex JSON extraction failed:', innerError.message);
        throw new Error(`Failed to parse AI response from Gemini: ${innerError.message}`);
      }
    } else {
      console.error('💥 Raw generated content was:', generatedContent);
      throw new Error(`Failed to parse AI response from Gemini: ${e.message}`);
    }
  }

  // Normalize structure
  if (parsedJson && !parsedJson.weeks && parsedJson.Weeks) {
    parsedJson.weeks = parsedJson.Weeks;
  }
  if (parsedJson && !parsedJson.weeks && parsedJson.roadmap?.weeks) {
    parsedJson.weeks = parsedJson.roadmap.weeks;
  }

  // Run Zod validation
  const result = roadmapSchema.safeParse(parsedJson);
  if (!result.success) {
    console.error('💥 AI output schema validation failed:', result.error.format());
    throw new Error('Failed to validate learning roadmap structure: AI response is malformed.');
  }

  return result.data;
}
