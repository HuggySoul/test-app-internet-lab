import AsyncStorage from '@react-native-async-storage/async-storage';
import { isStringArray } from '../utils/validation';

const STORAGE_KEY = 'matches-task:favorites:v1';

let pendingWrite: Promise<void> = Promise.resolve();

export async function loadFavorites(): Promise<{
  ids: string[];
  warning?: string;
}> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);

  if (stored === null) return { ids: [] };

  let value: unknown;

  try {
    value = JSON.parse(stored);
  } catch {
    return {
      ids: [],
      warning: 'Сохранённое избранное повреждено. Список сброшен в памяти.',
    };
  }

  if (!isStringArray(value)) {
    return {
      ids: [],
      warning: 'Сохранённое избранное повреждено. Список сброшен в памяти.',
    };
  }

  return { ids: [...new Set(value)] };
}

export function saveFavorites(ids: readonly string[]): Promise<void> {
  const serialized = JSON.stringify(ids);

  // Ошибка одной записи не блокирует следующие; вызывающий код получает её отдельно.
  const write = pendingWrite
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized));

  pendingWrite = write;

  return write;
}
