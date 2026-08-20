/**
 * Database configuration using @neondatabase/serverless.
 *
 * WHY: Neon's standard PostgreSQL ports (5432, 6543) are blocked on many
 * networks/ISPs. The serverless driver uses WebSockets over port 443 (HTTPS)
 * which is always open. The API is identical to `pg` — pool.query() works
 * exactly the same everywhere else in the codebase.
 */
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Required for Node.js — browser environments have WebSocket built-in
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in environment variables');
}

export const pool = new Pool({ connectionString });

// Drop-in replacement — same signature as before
export const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Log and rethrow — caller handles errors
    console.error('DB query error:', err.message);
    throw err;
  }
};

// Auto-initialize PostgreSQL Database Schema
export const initDB = async () => {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Users Table
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Profiles Table
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Roadmaps Table
      CREATE TABLE IF NOT EXISTS public.roadmaps (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        skill_name TEXT NOT NULL,
        current_level TEXT NOT NULL,
        time_commitment TEXT NOT NULL,
        learning_style TEXT,
        end_goal TEXT,
        timeline TEXT,
        generated_data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Learning Resources Table
      CREATE TABLE IF NOT EXISTS public.learning_resources (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
        task_id TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        source TEXT,
        description TEXT,
        quality_score INT DEFAULT 4,
        difficulty_level TEXT DEFAULT 'beginner',
        estimated_time_minutes INT DEFAULT 30,
        tags TEXT[],
        is_official BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Subscribers Table
      CREATE TABLE IF NOT EXISTS public.subscribers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        subscribed BOOLEAN DEFAULT false,
        subscription_tier TEXT DEFAULT 'free',
        subscription_end TIMESTAMP WITH TIME ZONE,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        order_paid BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Roadmap Cache Table
      CREATE TABLE IF NOT EXISTS public.roadmap_cache (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cache_key TEXT UNIQUE NOT NULL,
        skill_name TEXT NOT NULL,
        level TEXT NOT NULL,
        time_commitment TEXT NOT NULL,
        cached_data JSONB NOT NULL,
        access_count INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- YouTube Cache Table
      CREATE TABLE IF NOT EXISTS public.youtube_cache (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        search_query TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        video_data JSONB NOT NULL,
        access_count INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(search_query, skill_name)
      );

      -- API Usage Tracking Table
      CREATE TABLE IF NOT EXISTS public.api_usage_tracking (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        api_type TEXT NOT NULL,
        endpoint TEXT,
        request_count INT DEFAULT 1,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Task Progress Table
      CREATE TABLE IF NOT EXISTS public.task_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
        task_id TEXT NOT NULL,
        completed BOOLEAN DEFAULT false,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id, roadmap_id, task_id)
      );

      -- Contact Messages Table
      CREATE TABLE IF NOT EXISTS public.contact_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    console.log('✅ PostgreSQL database schema synchronized successfully.');
  } catch (err) {
    console.error('⚠️ Database schema initialization notice:', err.message);
  }
};
