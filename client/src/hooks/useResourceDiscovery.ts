import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

export interface LearningResource {
  id: string;
  task_id: string;
  skill_name: string;
  title: string;
  url: string;
  resource_type: 'reading' | 'video' | 'interactive' | 'audio' | 'visual';
  source: string;
  description?: string;
  quality_score: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_minutes: number;
  tags: string[];
  metadata: any;
  is_official: boolean;
  roadmap_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserResourceProgress {
  id: string;
  user_id: string;
  resource_id: string;
  roadmap_id: string;
  status: 'planned' | 'in_progress' | 'completed' | 'bookmarked' | 'skipped';
  started_at?: string;
  completed_at?: string;
  rating?: number;
  notes?: string;
}

export const useResourceDiscovery = (taskId: string, skillName: string, roadmapId: string) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserResourceProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (taskId && skillName && roadmapId) {
      fetchResources();
    }
  }, [taskId, skillName, roadmapId, user]);

  const fetchResources = async () => {
    console.log('🔍 Fetching resources for task:', taskId, 'roadmap:', roadmapId);
    
    try {
      const res = await fetch(`${EXPRESS_SERVER_URL}/api/roadmap/resources/${roadmapId}/${taskId}`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      
      const data = await res.json();
      const rawResources = data.resources || [];
      
      console.log(`📚 Found ${rawResources.length} resources for task ${taskId}`);
      
      const typedResources = rawResources.map((item: any) => ({
        ...item,
        resource_type: item.resource_type as LearningResource['resource_type'],
        difficulty_level: item.difficulty_level as LearningResource['difficulty_level']
      }));
      
      setResources(typedResources);
    } catch (error) {
      console.error('💥 Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateResourceStatus = async (resourceId: string, status: UserResourceProgress['status']) => {
    // Local state progress tracker
    setUserProgress(prev => ({
      ...prev,
      [resourceId]: {
        id: resourceId,
        user_id: user?.id || 'guest',
        resource_id: resourceId,
        roadmap_id: roadmapId,
        status,
        updated_at: new Date().toISOString()
      }
    }));
  };

  const getResourcesByType = (type: LearningResource['resource_type']) => {
    return resources.filter(resource => resource.resource_type === type);
  };

  const getResourceTypeCounts = () => {
    return resources.reduce((acc, resource) => {
      acc[resource.resource_type] = (acc[resource.resource_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    resources,
    userProgress,
    loading,
    updateResourceStatus,
    getResourcesByType,
    getResourceTypeCounts,
    refetch: fetchResources
  };
};
