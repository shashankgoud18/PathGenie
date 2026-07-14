import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://obzbljyuydzavtjzaikq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export function getSupabaseClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export async function checkUserSubscription(supabase: any, userId: string, email: string) {
  let { data: subscriber } = await supabase
    .from('subscribers')
    .select('subscribed, subscription_tier, subscription_end')
    .eq('user_id', userId)
    .maybeSingle();

  if (!subscriber && email) {
    const { data: byEmail } = await supabase
      .from('subscribers')
      .select('id, subscribed, subscription_tier, subscription_end')
      .eq('email', email)
      .maybeSingle();

    if (byEmail) {
      await supabase
        .from('subscribers')
        .update({ user_id: userId })
        .eq('id', byEmail.id);
      
      subscriber = byEmail;
    }
  }

  if (!subscriber) {
    const uniqueEmail = email || `user-${userId}@pathgenie.local`;
    await supabase
      .from('subscribers')
      .insert({
        user_id: userId,
        email: uniqueEmail,
        subscribed: false,
        subscription_tier: 'free'
      });
    return { tier: 'free', subscribed: false };
  }

  const isActive = subscriber.subscribed && 
    (!subscriber.subscription_end || new Date(subscriber.subscription_end) > new Date());

  return {
    tier: isActive ? subscriber.subscription_tier : 'free',
    subscribed: isActive
  };
}

export async function checkRateLimit(supabase: any, userId: string, apiType: string, limit: number) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  
  const { data: usageData } = await supabase
    .from('api_usage_tracking')
    .select('request_count')
    .eq('user_id', userId)
    .eq('api_type', apiType)
    .gte('date', monthStart);

  const currentCount = usageData?.reduce((sum: number, item: any) => sum + item.request_count, 0) || 0;
  return currentCount < limit;
}

export async function incrementUsage(supabase: any, userId: string, apiType: string, endpoint: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabase
    .from('api_usage_tracking')
    .select('id, request_count')
    .eq('user_id', userId)
    .eq('api_type', apiType)
    .eq('date', today)
    .single();

  if (existing) {
    await supabase
      .from('api_usage_tracking')
      .update({ 
        request_count: existing.request_count + 1,
        endpoint 
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('api_usage_tracking')
      .insert({
        user_id: userId,
        api_type: apiType,
        endpoint,
        request_count: 1,
        date: today
      });
  }
}

export async function saveRoadmapToDB(supabase: any, userId: string, data: Record<string, any>) {
  const { skill, level, timeCommitment, learningStyle, goal, timeline, generated_data } = data;
  
  const { data: roadmap, error: insertError } = await supabase
    .from('roadmaps')
    .insert({
      user_id: userId,
      skill_name: skill,
      current_level: level,
      time_commitment: timeCommitment,
      learning_style: learningStyle,
      end_goal: goal,
      timeline: timeline?.toString() || '4',
      generated_data
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to save roadmap: ${insertError.message}`);
  }

  return roadmap;
}
