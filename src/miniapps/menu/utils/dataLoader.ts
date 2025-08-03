import categoriesData from '../data/categories.json';
import menuItemsData from '../data/menuItems.json';
import tagsData from '../data/tags.json';

export interface Category {
  id: string;
  name: string;
  label: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  backgroundColor: string;
  description: string;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  weight: string;
  description: string;
  price: number;
  image: string;
  tags: number[];
  category: string;
  addons: Addon[];
  recommendedItems: number[]; // массив ID рекомендуемых блюд
}

// Загружаем категории
export const getCategories = (): Category[] => {
  return categoriesData as Category[];
};

// Загружаем все блюда меню
export const getMenuItems = (): MenuItem[] => {
  return menuItemsData as MenuItem[];
};

// Загружаем все теги
export const getTags = (): Tag[] => {
  return tagsData as Tag[];
};

// Получаем тег по ID
export const getTagById = (id: number): Tag | undefined => {
  return getTags().find(tag => tag.id === id);
};

// Получаем теги для блюда
export const getTagsForItem = (itemId: number): Tag[] => {
  const item = getMenuItemById(itemId);
  if (!item) return [];
  
  return item.tags
    .map(tagId => getTagById(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
};

// Загружаем блюдо по ID
export const getMenuItemById = (id: number): MenuItem | undefined => {
  return getMenuItems().find(item => item.id === id);
};

// Загружаем блюда по категории
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return getMenuItems().filter(item => item.category === category);
};

// Получаем добавки для конкретного товара
export const getAddonsForItem = (itemId: number): Addon[] => {
  const item = getMenuItemById(itemId);
  return item?.addons || [];
};

// Получаем все добавки (для обратной совместимости)
export const getAddons = (): Addon[] => {
  const allAddons: Addon[] = [];
  const menuItems = getMenuItems();
  
  menuItems.forEach(item => {
    item.addons.forEach(addon => {
      if (!allAddons.find(existing => existing.id === addon.id)) {
        allAddons.push(addon);
      }
    });
  });
  
  return allAddons;
};

// Получаем рекомендуемые блюда для конкретного товара
export const getRecommendedItemsForItem = (itemId: number): MenuItem[] => {
  const item = getMenuItemById(itemId);
  if (!item || !item.recommendedItems) return [];
  
  return item.recommendedItems
    .map(id => getMenuItemById(id))
    .filter((item): item is MenuItem => item !== undefined);
};

// Рассчитываем цену добавок
export const calculateAddonsPrice = (selectedAddonIds: number[]): number => {
  const allAddons = getAddons();
  return selectedAddonIds
    .map(id => allAddons.find(addon => addon.id === id))
    .filter(addon => addon !== undefined)
    .reduce((sum, addon) => sum + (addon?.price || 0), 0);
};

// Получаем названия добавок
export const getAddonNames = (selectedAddonIds: number[]): string[] => {
  const allAddons = getAddons();
  return selectedAddonIds
    .map(id => allAddons.find(addon => addon.id === id))
    .filter(addon => addon !== undefined)
    .map(addon => addon!.name);
}; 