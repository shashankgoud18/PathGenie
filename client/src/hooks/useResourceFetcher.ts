
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningResource } from './useResourceDiscovery';

interface ResourceFetcherOptions {
  taskId: string;
  skillName: string;
  taskTitle: string;
  taskType: string;
  roadmapId: string;
}

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

export const useResourceFetcher = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResourcesForTask = async (options: ResourceFetcherOptions) => {
    console.log('🚀 Starting resource generation for task:', options.taskId);
    console.log('📋 Task details:', {
      title: options.taskTitle,
      skill: options.skillName,
      type: options.taskType,
      roadmapId: options.roadmapId
    });
    
    setIsGenerating(true);
    
    try {
      console.log('📡 Calling generate resources Express API...');
      
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/roadmap/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          taskId: options.taskId,
          skillName: options.skillName,
          taskTitle: options.taskTitle,
          taskType: options.taskType,
          roadmapId: options.roadmapId
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to generate resources');
      }

      const data = await res.json();

      console.log('✅ Express API response:', data);
      console.log(`📊 Generated ${data?.resources?.length || 0} resources`);
      
      return data;
    } catch (error) {
      console.error('💥 Error in resource generation:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      console.log('🏁 Resource generation process completed');
    }
  };

  return {
    generateResourcesForTask,
    isGenerating
  };
};
