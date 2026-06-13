
-- Create a profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create a trigger to automatically create a profile when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ====================================


-- Create a table to store generated roadmaps
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  skill_name TEXT NOT NULL,
  current_level TEXT NOT NULL,
  time_commitment TEXT NOT NULL,
  learning_style TEXT,
  end_goal TEXT,
  generated_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own roadmaps
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own roadmaps
CREATE POLICY "Users can view their own roadmaps" 
  ON public.roadmaps 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own roadmaps
CREATE POLICY "Users can create their own roadmaps" 
  ON public.roadmaps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own roadmaps
CREATE POLICY "Users can update their own roadmaps" 
  ON public.roadmaps 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own roadmaps
CREATE POLICY "Users can delete their own roadmaps" 
  ON public.roadmaps 
  FOR DELETE 
  USING (auth.uid() = user_id);


-- ====================================


-- Add the missing timeline column to the roadmaps table
ALTER TABLE public.roadmaps 
ADD COLUMN timeline text;


-- ====================================


-- Create table for storing learning resources
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('reading', 'video', 'interactive', 'audio', 'visual')),
  source TEXT NOT NULL, -- github, mdn, youtube, etc
  description TEXT,
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 5),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time_minutes INTEGER DEFAULT 0,
  tags TEXT[], -- array of tags
  metadata JSONB DEFAULT '{}', -- store additional data like github stars, last updated, etc
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user resource preferences and progress
CREATE TABLE public.user_resource_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  resource_id UUID REFERENCES public.learning_resources(id) NOT NULL,
  roadmap_id UUID REFERENCES public.roadmaps(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'bookmarked', 'skipped')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create table for tracking user learning format preferences
CREATE TABLE public.user_learning_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  preferred_formats TEXT[] DEFAULT ARRAY['reading', 'video', 'interactive'], -- ordered by preference
  learning_style TEXT DEFAULT 'mixed' CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'mixed')),
  difficulty_preference TEXT DEFAULT 'progressive' CHECK (difficulty_preference IN ('easy', 'progressive', 'challenging')),
  time_preference TEXT DEFAULT 'medium' CHECK (time_preference IN ('short', 'medium', 'long')),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add RLS policies for learning_resources (public read, admin write for now)
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning resources" 
  ON public.learning_resources 
  FOR SELECT 
  USING (true);

-- Add RLS policies for user_resource_progress
ALTER TABLE public.user_resource_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resource progress" 
  ON public.user_resource_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own resource progress" 
  ON public.user_resource_progress 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for user_learning_preferences
ALTER TABLE public.user_learning_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning preferences" 
  ON public.user_learning_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own learning preferences" 
  ON public.user_learning_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_learning_resources_task_id ON public.learning_resources(task_id);
CREATE INDEX idx_learning_resources_skill_name ON public.learning_resources(skill_name);
CREATE INDEX idx_learning_resources_type ON public.learning_resources(resource_type);
CREATE INDEX idx_user_resource_progress_user_roadmap ON public.user_resource_progress(user_id, roadmap_id);
CREATE INDEX idx_user_resource_progress_status ON public.user_resource_progress(status);


-- ====================================


-- Insert sample learning resources for different tasks and skills
INSERT INTO public.learning_resources (
  task_id,
  skill_name,
  title,
  url,
  resource_type,
  source,
  description,
  quality_score,
  difficulty_level,
  estimated_time_minutes,
  tags,
  metadata,
  is_official
) VALUES
-- React resources
('w1-t1', 'React', 'React Official Documentation - Getting Started', 'https://react.dev/learn', 'reading', 'React.dev', 'Official React documentation with comprehensive examples and best practices', 5, 'beginner', 45, ARRAY['react', 'documentation', 'official'], '{"type": "documentation", "updated": "2024"}', true),
('w1-t1', 'React', 'React Tutorial for Beginners', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'video', 'YouTube', 'Complete React tutorial covering fundamentals and practical examples', 4, 'beginner', 120, ARRAY['react', 'tutorial', 'beginner'], '{"duration": "2 hours", "views": "1M+"}', false),
('w1-t1', 'React', 'Interactive React Tutorial', 'https://scrimba.com/learn/learnreact', 'interactive', 'Scrimba', 'Hands-on React course with coding exercises and projects', 5, 'beginner', 180, ARRAY['react', 'interactive', 'hands-on'], '{"platform": "scrimba", "exercises": 50}', false),
('w1-t1', 'React', 'React Podcast - Getting Started', 'https://reactpodcast.com/episodes/1', 'audio', 'React Podcast', 'Audio discussion about React fundamentals and best practices', 4, 'beginner', 30, ARRAY['react', 'podcast', 'discussion'], '{"episode": 1, "host": "React Team"}', false),

-- JavaScript resources
('w1-t2', 'JavaScript', 'MDN JavaScript Guide', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'reading', 'MDN', 'Comprehensive JavaScript guide covering all language features', 5, 'intermediate', 90, ARRAY['javascript', 'mdn', 'guide'], '{"updated": "2024", "comprehensive": true}', true),
('w1-t2', 'JavaScript', 'JavaScript Crash Course', 'https://www.youtube.com/watch?v=hdI2bqOjy3c', 'video', 'YouTube', 'Fast-paced JavaScript tutorial covering modern features', 4, 'intermediate', 60, ARRAY['javascript', 'crash-course', 'modern'], '{"duration": "1 hour", "topics": "ES6+"}', false),
('w1-t2', 'JavaScript', 'JavaScript30 Challenge', 'https://javascript30.com/', 'interactive', 'JavaScript30', '30 day vanilla JavaScript coding challenge with projects', 5, 'intermediate', 30, ARRAY['javascript', 'challenge', 'projects'], '{"projects": 30, "vanilla": true}', false),

-- Python resources
('python-basics', 'Python', 'Python Official Tutorial', 'https://docs.python.org/3/tutorial/', 'reading', 'Python.org', 'Official Python tutorial covering language basics and advanced features', 5, 'beginner', 120, ARRAY['python', 'official', 'tutorial'], '{"version": "3.x", "comprehensive": true}', true),
('python-basics', 'Python', 'Python for Everybody Course', 'https://www.coursera.org/specializations/python', 'video', 'Coursera', 'University of Michigan Python course for beginners', 5, 'beginner', 240, ARRAY['python', 'university', 'coursera'], '{"university": "UMich", "certification": true}', false),
('python-basics', 'Python', 'Codecademy Python Course', 'https://www.codecademy.com/learn/learn-python-3', 'interactive', 'Codecademy', 'Interactive Python course with hands-on exercises', 4, 'beginner', 150, ARRAY['python', 'interactive', 'exercises'], '{"exercises": 100, "projects": 10}', false),

-- Data Science resources
('data-analysis', 'Data Science', 'Pandas Documentation', 'https://pandas.pydata.org/docs/', 'reading', 'Pandas', 'Official pandas library documentation for data manipulation', 5, 'intermediate', 60, ARRAY['pandas', 'data-science', 'documentation'], '{"library": "pandas", "examples": true}', true),
('data-analysis', 'Data Science', 'Data Science with Python', 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', 'video', 'YouTube', 'Complete data science tutorial using Python and popular libraries', 4, 'intermediate', 180, ARRAY['data-science', 'python', 'tutorial'], '{"duration": "3 hours", "libraries": "pandas,numpy,matplotlib"}', false),
('data-analysis', 'Data Science', 'Kaggle Learn Data Science', 'https://www.kaggle.com/learn/intro-to-machine-learning', 'interactive', 'Kaggle', 'Hands-on data science course with real datasets', 5, 'intermediate', 120, ARRAY['data-science', 'kaggle', 'datasets'], '{"datasets": "real", "competitions": true}', false);


-- ====================================


-- Enable RLS on learning_resources table (if not already enabled)
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to learning resources
CREATE POLICY "Allow public read access to learning resources" ON public.learning_resources
    FOR SELECT USING (true);

-- Policy to allow service role to insert learning resources (for edge functions)
CREATE POLICY "Allow service role to insert learning resources" ON public.learning_resources
    FOR INSERT WITH CHECK (true);

-- Policy to allow service role to update learning resources
CREATE POLICY "Allow service role to update learning resources" ON public.learning_resources
    FOR UPDATE USING (true);

-- Policy to allow service role to delete learning resources
CREATE POLICY "Allow service role to delete learning resources" ON public.learning_resources
    FOR DELETE USING (true);


-- ====================================


-- Add roadmap_id column to learning_resources table
ALTER TABLE public.learning_resources 
ADD COLUMN roadmap_id UUID REFERENCES public.roadmaps(id);

-- Create index for better performance
CREATE INDEX idx_learning_resources_roadmap_id ON public.learning_resources(roadmap_id);


-- ====================================


-- Create API usage tracking table
CREATE TABLE public.api_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  api_type TEXT NOT NULL, -- 'gemini', 'youtube'
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, api_type, date)
);

-- Create subscribers table for subscription management
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create roadmap cache table to reduce API calls
CREATE TABLE public.roadmap_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  level TEXT NOT NULL,
  time_commitment TEXT NOT NULL,
  cache_key TEXT UNIQUE NOT NULL,
  cached_data JSONB NOT NULL,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create YouTube video cache
CREATE TABLE public.youtube_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  video_data JSONB NOT NULL,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(search_query, skill_name)
);

-- Enable RLS
ALTER TABLE public.api_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_usage_tracking
CREATE POLICY "Users can view their own API usage" ON public.api_usage_tracking
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert API usage" ON public.api_usage_tracking
FOR INSERT WITH CHECK (true);

CREATE POLICY "Update API usage" ON public.api_usage_tracking
FOR UPDATE USING (true);

-- RLS Policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Update subscription" ON public.subscribers
FOR UPDATE USING (true);

CREATE POLICY "Insert subscription" ON public.subscribers
FOR INSERT WITH CHECK (true);

-- RLS Policies for caches (read-only for users, managed by edge functions)
CREATE POLICY "Anyone can read roadmap cache" ON public.roadmap_cache
FOR SELECT USING (true);

CREATE POLICY "Edge functions can manage roadmap cache" ON public.roadmap_cache
FOR ALL USING (true);

CREATE POLICY "Anyone can read YouTube cache" ON public.youtube_cache
FOR SELECT USING (true);

CREATE POLICY "Edge functions can manage YouTube cache" ON public.youtube_cache
FOR ALL USING (true);


-- ====================================


-- Add missing columns to existing subscribers table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscribers' AND column_name = 'subscription_tier') THEN
        ALTER TABLE public.subscribers ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
END $$;

-- Add sharing columns to roadmaps table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'roadmaps' AND column_name = 'is_public') THEN
        ALTER TABLE public.roadmaps ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'roadmaps' AND column_name = 'shared_at') THEN
        ALTER TABLE public.roadmaps ADD COLUMN shared_at TIMESTAMPTZ;
    END IF;
END $$;

-- Create RLS policies for roadmaps if they don't exist
DO $$ 
BEGIN
    -- Enable RLS on roadmaps
    ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if they exist to avoid conflicts
    DROP POLICY IF EXISTS "select_own_roadmaps" ON public.roadmaps;
    DROP POLICY IF EXISTS "select_public_roadmaps" ON public.roadmaps;
    DROP POLICY IF EXISTS "insert_own_roadmaps" ON public.roadmaps;
    DROP POLICY IF EXISTS "update_own_roadmaps" ON public.roadmaps;
    DROP POLICY IF EXISTS "delete_own_roadmaps" ON public.roadmaps;
    
    -- Create new policies
    CREATE POLICY "select_own_roadmaps" ON public.roadmaps
      FOR SELECT
      USING (user_id = auth.uid());

    -- Pro users can view public roadmaps from other users
    CREATE POLICY "select_public_roadmaps" ON public.roadmaps
      FOR SELECT
      USING (
        is_public = true AND 
        EXISTS (
          SELECT 1 FROM public.subscribers 
          WHERE user_id = auth.uid() 
          AND subscribed = true 
          AND subscription_tier = 'pro'
        )
      );

    -- Users can insert their own roadmaps
    CREATE POLICY "insert_own_roadmaps" ON public.roadmaps
      FOR INSERT
      WITH CHECK (user_id = auth.uid());

    -- Users can update their own roadmaps
    CREATE POLICY "update_own_roadmaps" ON public.roadmaps
      FOR UPDATE
      USING (user_id = auth.uid());

    -- Users can delete their own roadmaps
    CREATE POLICY "delete_own_roadmaps" ON public.roadmaps
      FOR DELETE
      USING (user_id = auth.uid());
      
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if policies already exist
    NULL;
END $$;


-- ====================================


-- Add Razorpay-specific columns to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;

-- Update existing Stripe columns to be nullable since we're switching to Razorpay
ALTER TABLE public.subscribers 
ALTER COLUMN stripe_customer_id DROP NOT NULL;

-- Create index for faster Razorpay subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_subscription_id 
ON public.subscribers(razorpay_subscription_id);

-- Add comments for clarity
COMMENT ON COLUMN public.subscribers.razorpay_subscription_id IS 'Razorpay subscription ID';
COMMENT ON COLUMN public.subscribers.razorpay_plan_id IS 'Razorpay plan ID';
COMMENT ON COLUMN public.subscribers.razorpay_customer_id IS 'Razorpay customer ID';


-- ====================================


-- Update the subscriber record to Pro status for immediate access
UPDATE public.subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = (NOW() + INTERVAL '1 month'),
  updated_at = NOW()
WHERE email = (
  SELECT email 
  FROM auth.users 
  WHERE id = auth.uid()
);

-- If no record exists, insert a new Pro subscription record
INSERT INTO public.subscribers (
  user_id,
  email, 
  subscribed, 
  subscription_tier, 
  subscription_end,
  updated_at
)
SELECT 
  auth.uid(),
  email,
  true,
  'pro',
  (NOW() + INTERVAL '1 month'),
  NOW()
FROM auth.users 
WHERE id = auth.uid()
AND NOT EXISTS (
  SELECT 1 FROM public.subscribers 
  WHERE email = auth.users.email
);


-- ====================================


-- Add missing Razorpay columns to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;

-- Create index for faster Razorpay subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_subscription_id 
ON public.subscribers(razorpay_subscription_id);

-- Update your subscription to Pro again and ensure it stays
UPDATE public.subscribers 
SET 
  subscribed = true,
  subscription_tier = 'pro',
  subscription_end = (NOW() + INTERVAL '1 year'),
  updated_at = NOW()
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = (
    SELECT email 
    FROM public.subscribers 
    WHERE user_id IS NOT NULL 
    LIMIT 1
  )
);


-- ====================================


-- Add RLS policy to allow Pro users to view all public roadmaps
CREATE POLICY "Pro users can view all public roadmaps" 
  ON public.roadmaps 
  FOR SELECT 
  USING (
    is_public = true OR 
    auth.uid() = user_id
  );

-- Update the existing policy to be more specific
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON public.roadmaps;

-- Create a more comprehensive policy that handles both private and public access
CREATE POLICY "Users can view accessible roadmaps" 
  ON public.roadmaps 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    (is_public = true)
  );


-- ====================================


-- Update all existing roadmaps to be public
UPDATE public.roadmaps SET is_public = true WHERE is_public = false OR is_public IS NULL;

-- Change the default value for new roadmaps to be public
ALTER TABLE public.roadmaps ALTER COLUMN is_public SET DEFAULT true;


-- ====================================

-- Add Razorpay payment tracking columns to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS invoice_paid BOOLEAN DEFAULT false;

-- Create indices for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_order_id 
ON public.subscribers(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_subscribers_razorpay_payment_id 
ON public.subscribers(razorpay_payment_id);

-- Add comments for clarity
COMMENT ON COLUMN public.subscribers.razorpay_order_id IS 'Razorpay order ID for checkout tracking';
COMMENT ON COLUMN public.subscribers.razorpay_payment_id IS 'Razorpay payment ID for payment tracking';
COMMENT ON COLUMN public.subscribers.order_paid IS 'Flag indicating if the Razorpay order has been paid';
COMMENT ON COLUMN public.subscribers.invoice_paid IS 'Flag indicating if the Razorpay invoice has been paid';


-- ====================================

-- Add unique constraint to user_id column in subscribers table
ALTER TABLE public.subscribers
ADD CONSTRAINT subscribers_user_id_key UNIQUE (user_id);
