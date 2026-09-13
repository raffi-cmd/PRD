import { useEffect, useState, useRef } from 'react';
import { ProjectSchema } from '../types/project';
import { saveProjectToDB } from '../services/storage/indexedDb';

export type SaveStatus = 'saved' | 'saving' | 'error';

export function useAutoSave(project: ProjectSchema, enabled = true, debounceMs = 800): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    // Skip auto-save on initial mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setStatus('saving');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        await saveProjectToDB(project);
        setStatus('saved');
      } catch (err) {
        console.error('AutoSave failed:', err);
        setStatus('error');
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [project, enabled, debounceMs]);

  return status;
}
