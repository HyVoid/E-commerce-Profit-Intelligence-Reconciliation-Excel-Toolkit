import { EngineDataStore } from '../types';
import { INITIAL_SEED_DATA } from '../data/seedData';

const LOCAL_STORAGE_KEY = 'ECOMMERCE_PROFIT_ENGINE_STORE_V1';

/**
 * Load store from localStorage or return default seed data
 */
export function loadEngineStore(): EngineDataStore {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      saveEngineStore(INITIAL_SEED_DATA);
      return INITIAL_SEED_DATA;
    }
    const parsed = JSON.parse(raw) as EngineDataStore;
    // Validate minimal structure
    if (!parsed.parameters || !parsed.orders || !parsed.rateHistory) {
      console.warn('LocalStorage data structure incomplete, reverting to seed data.');
      return INITIAL_SEED_DATA;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse store from localStorage:', err);
    return INITIAL_SEED_DATA;
  }
}

/**
 * Save store to localStorage with updated timestamp
 */
export function saveEngineStore(store: EngineDataStore): EngineDataStore {
  const updated: EngineDataStore = {
    ...store,
    lastSaved: new Date().toISOString(),
  };
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save store to localStorage:', err);
  }
  return updated;
}

/**
 * Reset store back to initial seed data
 */
export function resetEngineStore(): EngineDataStore {
  return saveEngineStore({
    ...INITIAL_SEED_DATA,
    lastSaved: new Date().toISOString(),
  });
}
