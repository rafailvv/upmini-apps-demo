interface TempItemData {
  selectedAddons: number[];
  comment: string;
}

// Временное хранилище данных для товаров
const tempDataStore: Map<number, TempItemData> = new Map();

export const saveTempItemData = (itemId: number, selectedAddons: number[], comment: string) => {
  tempDataStore.set(itemId, {
    selectedAddons: [...selectedAddons],
    comment: comment
  });
};

export const getTempItemData = (itemId: number): TempItemData | null => {
  return tempDataStore.get(itemId) || null;
};

export const clearTempItemData = (itemId: number) => {
  tempDataStore.delete(itemId);
};

export const clearAllTempData = () => {
  tempDataStore.clear();
}; 