import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

/**
 * Manages task completion state for a roadmap.
 *
 * Strategy:
 *  1. On mount — fetch server progress, merge with localStorage (server wins on conflict).
 *  2. On toggle — update localStorage immediately (optimistic), then sync to server in the background.
 *  3. On bulk-complete — same pattern but uses the /bulk endpoint.
 */
export const useRoadmapProgress = (roadmapId: string) => {
  const { token } = useAuth();
  const LOCAL_KEY = `pathgenie-roadmap-progress-${roadmapId}`;

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [syncing, setSyncing] = useState(false);

  // ── Fetch server state on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!roadmapId || !token) return;

    fetch(`${EXPRESS_SERVER_URL}/api/progress/${roadmapId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.completedTaskIds)) {
          setCompletedTasks((prev) => {
            // Merge: server completed + locally completed
            const merged = new Set([...prev, ...data.completedTaskIds]);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(merged)));
            return merged;
          });
        }
      })
      .catch(() => {/* silently ignore — use local state */});
  }, [roadmapId, token]);

  // ── Toggle single task ──────────────────────────────────────────────────
  const toggleTask = useCallback(
    (taskId: string): { isChecking: boolean; newCompleted: Set<string> } => {
      const newCompleted = new Set(completedTasks);
      let isChecking = false;

      if (newCompleted.has(taskId)) {
        newCompleted.delete(taskId);
      } else {
        newCompleted.add(taskId);
        isChecking = true;
      }

      setCompletedTasks(newCompleted);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(newCompleted)));

      // Background sync to server
      if (token) {
        fetch(`${EXPRESS_SERVER_URL}/api/progress/${roadmapId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, completed: isChecking }),
        }).catch(() => {});
      }

      return { isChecking, newCompleted };
    },
    [completedTasks, roadmapId, token]
  );

  // ── Bulk complete a week ────────────────────────────────────────────────
  const bulkCompleteWeek = useCallback(
    async (taskIds: string[]) => {
      const newCompleted = new Set(completedTasks);
      taskIds.forEach((id) => newCompleted.add(id));
      setCompletedTasks(newCompleted);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(newCompleted)));

      if (token) {
        setSyncing(true);
        try {
          await fetch(`${EXPRESS_SERVER_URL}/api/progress/${roadmapId}/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ taskIds }),
          });
        } catch {
          // Already persisted locally — silently ignore
        } finally {
          setSyncing(false);
        }
      }

      return newCompleted;
    },
    [completedTasks, roadmapId, token]
  );

  return { completedTasks, toggleTask, bulkCompleteWeek, syncing };
};
