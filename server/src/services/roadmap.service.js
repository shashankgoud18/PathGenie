import { getAIModel } from '../config/gemini.js';
import { query } from '../config/db.js';
import { redis } from '../config/redis.js';
import { CacheService } from './cache.service.js';

export class RoadmapService {
  /**
   * Generates a learning roadmap using Gemini, caching, locks, and schema check.
   */
  static async generateRoadmap(userId, params) {
    const { skill, level, timeCommitment, learningStyle, goal, timeline } = params;
    const timelineWeeks = timeline ? parseInt(timeline.toString()) : 4;

    const cacheKey = CacheService.getRoadmapKey(
      skill, level, timeCommitment, learningStyle, goal, timelineWeeks
    );

    // 1. Check cache first
    const cached = await CacheService.getRoadmap(cacheKey);
    if (cached) {
      const roadmap = await this.saveRoadmapToDB(userId, skill, level, timeCommitment, learningStyle, goal, timelineWeeks, cached);
      return {
        success: true,
        roadmapId: roadmap.id,
        roadmapData: cached,
        fromCache: true
      };
    }

    // 2. Cache Stampede Lock Protection
    const lockKey = `lock:${cacheKey}`;
    let isLocked = false;

    if (redis) {
      try {
        const acquired = await redis.set(lockKey, 'locked', { nx: true, ex: 10 });
        if (!acquired) {
          // Poll for max 6 seconds (12 * 500ms)
          for (let i = 0; i < 12; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const doubleCheck = await CacheService.getRoadmap(cacheKey);
            if (doubleCheck) {
              const roadmap = await this.saveRoadmapToDB(userId, skill, level, timeCommitment, learningStyle, goal, timelineWeeks, doubleCheck);
              return {
                success: true,
                roadmapId: roadmap.id,
                roadmapData: doubleCheck,
                fromCache: true
              };
            }
          }
        } else {
          isLocked = true;
        }
      } catch (err) {
        // Fall back without lock
      }
    }

    try {
      const model = getAIModel();
      if (!model) {
        throw new Error('Gemini AI model SDK is not configured on server');
      }

      const prompt = `Create a detailed ${timelineWeeks}-week learning roadmap for "${skill}".\n\nRequirements:\n- Current Level: ${level}\n- Weekly Time Commitment: ${timeCommitment} hours\n- Learning Style: ${learningStyle || 'Mixed'}\n- End Goal: ${goal || 'General mastery'}\n- Timeline: ${timelineWeeks} weeks\n\nReturn ONLY a valid JSON object with this exact structure:\n{\n  "title": "${skill} Mastery Roadmap",\n  "duration": "${timelineWeeks} Weeks",\n  "totalHours": "${timeCommitment}",\n  "motivationalTip": "Stay consistent and practice daily!",\n  "summary": "This roadmap will guide you to master ${skill}",\n  "weeks": [\n    {\n      "week": 1,\n      "title": "Foundation & Setup",\n      "description": "Build fundamentals and setup",\n      "difficulty": "Beginner",\n      "estimatedHours": "${timeCommitment} hours",\n      "goals": ["Learn basics", "Setup environment", "First practice"],\n      "tasks": [\n        {\n          "id": "w1-t1",\n          "title": "Learn ${skill} fundamentals and core concepts",\n          "type": "video",\n          "duration": "2 hours",\n          "resource": "Official documentation"\n        },\n        {\n          "id": "w1-t2", \n          "title": "Setup ${skill} development environment and tools",\n          "type": "practice",\n          "duration": "1 hour",\n          "resource": "Setup guide"\n        }\n      ],\n      "checkpoint": "Complete basic setup and understand core concepts"\n    }\n  ]\n}\n\nSPEED & CONCISENESS REQUIREMENT: To ensure maximum generation speed, keep all text fields (motivational tips, summaries, descriptions, checkpoints, and task titles) brief (maximum of 12 words per text block). Limit every week to exactly 3-4 key tasks to form a proper, comprehensive plan. Make titles descriptive but very concise.\n\nCRITICAL FOR LONG TIMELINES: If the timeline is more than 4 weeks (e.g., 8 or 12 weeks), you MUST keep all titles, descriptions, and goals short and concise, and limit each week to exactly 3 key tasks. This is absolutely necessary to ensure the entire JSON response fits within the token limits and does not get cut off.\n\nFor every task, make the title very specific and searchable for YouTube tutorials. Make titles descriptive and suitable for YouTube search.\n\nMake the roadmap progressive, practical, and tailored to ${level} level. Include ${timelineWeeks} weeks total.`;

      const response = await model.generateContent(prompt);
      const resultText = response.response.text();

      let cleanContent = resultText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      let parsedJson;

      try {
        parsedJson = JSON.parse(cleanContent);
      } catch (e) {
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedJson = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            throw new Error(`Failed to extract valid JSON from Gemini output: ${innerError.message}`);
          }
        } else {
          throw new Error(`Failed to parse AI response: ${e.message}`);
        }
      }

      // Normalize Weeks structure cases
      if (parsedJson && !parsedJson.weeks && parsedJson.Weeks) {
        parsedJson.weeks = parsedJson.Weeks;
      }
      if (parsedJson && !parsedJson.weeks && parsedJson.roadmap?.weeks) {
        parsedJson.weeks = parsedJson.roadmap.weeks;
      }

      // Save into cache tables (in background)
      CacheService.setRoadmap(cacheKey, skill, level, timeCommitment, parsedJson).catch(() => {});

      // Save to Database
      const roadmap = await this.saveRoadmapToDB(
        userId, skill, level, timeCommitment, learningStyle, goal, timelineWeeks, parsedJson
      );

      return {
        success: true,
        roadmapId: roadmap.id,
        roadmapData: parsedJson,
        fromCache: false
      };

    } finally {
      // Release lock
      if (isLocked && redis) {
        await redis.del(lockKey).catch(() => {});
      }
    }
  }

  /**
   * Helper database transaction to save roadmap values into PostgreSQL database.
   */
  static async saveRoadmapToDB(userId, skill, level, timeCommitment, learningStyle, goal, timelineWeeks, roadmapData) {
    const res = await query(
      `INSERT INTO roadmaps (user_id, skill_name, current_level, time_commitment, learning_style, end_goal, timeline, generated_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        skill,
        level,
        timeCommitment.toString(),
        learningStyle || 'Mixed',
        goal || '',
        timelineWeeks.toString(),
        JSON.stringify(roadmapData)
      ]
    );

    if (res.rows.length === 0) {
      throw new Error('Database save failed');
    }

    return res.rows[0];
  }

  /**
   * Fetch all roadmaps for a user
   */
  static async getUserRoadmaps(userId) {
    const res = await query(
      `SELECT * FROM roadmaps WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Fetch public community roadmaps
   */
  static async getPublicRoadmaps() {
    const res = await query(
      `SELECT * FROM roadmaps ORDER BY created_at DESC LIMIT 50`
    );
    return res.rows;
  }

  /**
   * Fetch single roadmap by ID
   */
  static async getRoadmapById(roadmapId, userId) {
    const res = await query(
      `SELECT * FROM roadmaps WHERE id = $1 AND user_id = $2`,
      [roadmapId, userId]
    );
    if (res.rows.length === 0) {
      throw new Error('Roadmap not found or unauthorized');
    }
    return res.rows[0];
  }

  /**
   * Delete a roadmap by ID
   */
  static async deleteRoadmap(roadmapId, userId) {
    const res = await query(
      `DELETE FROM roadmaps WHERE id = $1 AND user_id = $2 RETURNING id`,
      [roadmapId, userId]
    );
    if (res.rows.length === 0) {
      throw new Error('Roadmap not found or unauthorized');
    }
    return { success: true };
  }

  static async searchYouTubeResources(queryText) {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return [];

    // Extract skill name from query for cache lookup (first word is typically the skill)
    const skillName = queryText.split(' ')[0] || 'general';

    // 1. Check YouTube cache first (Redis → PG fallback)
    const cached = await CacheService.getYouTubeVideo(queryText, skillName);
    if (cached) {
      return Array.isArray(cached) ? cached : [];
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(queryText)}&type=video&order=relevance&maxResults=2&key=${key}`
      );

      const data = await response.json();

      const results = data.items?.map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        description: item.snippet.description,
        resourceType: 'video',
        source: `YouTube - ${item.snippet.channelTitle}`,
        estimatedTime: 30,
        difficultyLevel: 'beginner',
        tags: [queryText.toLowerCase().replace(/\s+/g, '-'), 'video', 'tutorial'],
        qualityScore: 4,
        isOfficial: item.snippet.channelTitle.toLowerCase().includes('official')
      })) || [];

      // 2. Persist to cache in background (30 day TTL)
      if (results.length > 0) {
        CacheService.setYouTubeVideo(queryText, skillName, results).catch(() => {});
      }

      return results;
    } catch (error) {
      return [];
    }
  }

  static async generateResourcesWithGemini(taskTitle, skillName, taskType) {
    const model = getAIModel();
    if (!model) {
      return [];
    }

    try {
      const prompt = `Generate exactly 3-4 high-quality, diverse learning resources for: "${taskTitle}" in the context of ${skillName}.

CRITICAL: Provide ONLY real, working URLs. Focus on quality over quantity.

Resource types needed:
1. 1 PDF tutorial/guide (official docs, O'Reilly, Manning, university materials)
2. 1 GitHub repository with examples/awesome list
3. 1-2 high-quality articles/documentation

For each resource, provide:
- title: Clear, descriptive title
- url: REAL, working URL (verify these exist)
- description: 50-80 words explaining the resource
- resourceType: one of [reading, interactive]
- source: The platform/organization name
- estimatedTime: time in minutes (15-60)
- difficultyLevel: beginner, intermediate, or advanced
- tags: 3-4 relevant tags
- qualityScore: 4-5 (only high quality)
- isOfficial: true if from official docs/organization

Return ONLY valid JSON array with 3-4 resources:
[
  {
    "title": "Official React Documentation",
    "url": "https://react.dev/learn",
    "description": "Official React documentation covering components, hooks, and best practices with interactive examples.",
    "resourceType": "reading",
    "source": "React.dev",
    "estimatedTime": 45,
    "difficultyLevel": "beginner",
    "tags": ["react", "official", "documentation", "components"],
    "qualityScore": 5,
    "isOfficial": true
  }
]`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();

      if (!text) {
        return [];
      }

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const resources = JSON.parse(jsonMatch[0]);
      return resources.map((resource) => ({
        title: resource.title || 'Untitled Resource',
        url: resource.url || '#',
        description: resource.description || 'No description available',
        resourceType: resource.resourceType || 'reading',
        source: resource.source || 'Unknown',
        estimatedTime: resource.estimatedTime || 30,
        difficultyLevel: resource.difficultyLevel || 'beginner',
        tags: resource.tags || [],
        qualityScore: resource.qualityScore || 4,
        isOfficial: resource.isOfficial || false
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetch resources for specific task & roadmap
   */
  static async getTaskResources(roadmapId, taskId) {
    const res = await query(
      `SELECT * FROM learning_resources WHERE roadmap_id = $1 AND task_id = $2`,
      [roadmapId, taskId]
    );
    return res.rows;
  }

  static async generateResources(userId, params) {
    const { taskId, skillName, taskTitle, taskType, roadmapId } = params;

    // Check if resources already exist in PostgreSQL
    const existingRes = await query(
      `SELECT * FROM learning_resources WHERE task_id = $1 AND roadmap_id = $2`,
      [taskId, roadmapId]
    );

    if (existingRes.rows.length > 0) {
      return { message: 'Resources already exist', resources: existingRes.rows };
    }

    // Generate resources
    const [youtubeResources, geminiResources] = await Promise.all([
      this.searchYouTubeResources(`${skillName} ${taskTitle} tutorial`),
      this.generateResourcesWithGemini(taskTitle, skillName, taskType)
    ]);

    const allResources = [...youtubeResources, ...geminiResources];
    if (allResources.length === 0) {
      return { message: 'No resources found', resources: [] };
    }

    const insertedResources = [];
    for (const resource of allResources) {
      const insRes = await query(
        `INSERT INTO learning_resources (
          roadmap_id, task_id, skill_name, title, url, resource_type, source,
          description, quality_score, difficulty_level, estimated_time_minutes, tags, is_official
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          roadmapId,
          taskId,
          skillName,
          resource.title,
          resource.url,
          resource.resourceType,
          resource.source,
          resource.description,
          resource.qualityScore,
          resource.difficultyLevel,
          resource.estimatedTime,
          resource.tags,
          resource.isOfficial
        ]
      );
      insertedResources.push(insRes.rows[0]);
    }

    return {
      message: `Generated ${insertedResources.length} focused resources`,
      resources: insertedResources
    };
  }
}
