// apps/web/src/lib/db.ts
import { openDB, DBSchema } from 'idb';

const DB_NAME = 'ai-personal-trainer-db';
const DB_VERSION = 1;

interface MyDB extends DBSchema {
  plans: {
    key: string;
    value: any;
  };
  logs: {
    key: string;
    value: any;
  };
}

export const initDB = async () => {
  const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('plans')) {
        db.createObjectStore('plans', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('logs')) {
        db.createObjectStore('logs', { keyPath: 'id' });
      }
    },
  });
  return db;
};

export const db = initDB();
