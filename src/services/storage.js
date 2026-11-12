import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  foods: '@foodrescue_foods',
  claims: '@foodrescue_claims',
};

export async function loadJSON(key, fallback) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (e) {
    console.warn('Storage clear failed', e);
  }
}
