import { ProjectSchema } from '../../types/project';

const DB_NAME = 'PlannerDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_ACTIVE = 'active_project';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'project.id' });
      }
      if (!db.objectStoreNames.contains(STORE_ACTIVE)) {
        db.createObjectStore(STORE_ACTIVE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProjectToDB(project: ProjectSchema): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_PROJECTS, STORE_ACTIVE], 'readwrite');
    tx.objectStore(STORE_PROJECTS).put(project);
    tx.objectStore(STORE_ACTIVE).put({ key: 'last_active_id', projectId: project.project.id });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails
    localStorage.setItem(`planner_proj_${project.project.id}`, JSON.stringify(project));
    localStorage.setItem('planner_last_active_id', project.project.id);
  }
}

export async function loadLastActiveProject(): Promise<ProjectSchema | null> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_PROJECTS, STORE_ACTIVE], 'readonly');

    const activeReq = tx.objectStore(STORE_ACTIVE).get('last_active_id');

    return new Promise((resolve) => {
      activeReq.onsuccess = () => {
        const lastId = activeReq.result?.projectId;
        if (!lastId) {
          resolve(loadFromLocalStorageFallback());
          return;
        }

        const projReq = tx.objectStore(STORE_PROJECTS).get(lastId);
        projReq.onsuccess = () => {
          if (projReq.result) {
            resolve(projReq.result as ProjectSchema);
          } else {
            resolve(loadFromLocalStorageFallback());
          }
        };
        projReq.onerror = () => resolve(loadFromLocalStorageFallback());
      };
      activeReq.onerror = () => resolve(loadFromLocalStorageFallback());
    });
  } catch {
    return loadFromLocalStorageFallback();
  }
}

function loadFromLocalStorageFallback(): ProjectSchema | null {
  const lastId = localStorage.getItem('planner_last_active_id');
  if (lastId) {
    const str = localStorage.getItem(`planner_proj_${lastId}`);
    if (str) {
      try {
        return JSON.parse(str) as ProjectSchema;
      } catch {
        return null;
      }
    }
  }
  return null;
}
