// Глобальное состояние избранного
let globalFavorites: { [key: number]: boolean } = {};
let favoritesSubscribers: (() => void)[] = [];

export const addToFavorites = (itemId: number) => {
  globalFavorites[itemId] = true;
  favoritesSubscribers.forEach(callback => callback());
};

export const removeFromFavorites = (itemId: number) => {
  delete globalFavorites[itemId];
  favoritesSubscribers.forEach(callback => callback());
};

export const toggleFavorite = (itemId: number) => {
  if (globalFavorites[itemId]) {
    removeFromFavorites(itemId);
  } else {
    addToFavorites(itemId);
  }
};

export const getFavorites = (): { [key: number]: boolean } => {
  return { ...globalFavorites };
};

export const isFavorite = (itemId: number): boolean => {
  return !!globalFavorites[itemId];
};

export const subscribeToFavoritesUpdates = (callback: () => void) => {
  favoritesSubscribers.push(callback);
  return () => {
    favoritesSubscribers = favoritesSubscribers.filter(cb => cb !== callback);
  };
};

export const clearFavorites = () => {
  globalFavorites = {};
  favoritesSubscribers.forEach(callback => callback());
}; 