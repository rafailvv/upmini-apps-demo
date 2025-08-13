import categoriesData from '../data/categories.json';
import menuItemsData from '../data/menuItems.json';
import tagsData from '../data/tags.json';

console.log('=== IMPORTS DEBUG ===');
console.log('categoriesData import:', categoriesData);
console.log('menuItemsData import:', menuItemsData);
console.log('tagsData import:', tagsData);
console.log('========================');

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
  size: string; // Для одежды используется size вместо weight
  description: string;
  price: number;
  image: string;
  tags: number[];
  category: string;
  addons: Addon[];
  recommendedItems: number[];
  stock: number; // Количество на складе
}

export interface PastOrder {
  id: string;
  date: string;
  status: 'completed' | 'cancelled';
  totalPrice: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    addons?: string[];
    comment?: string;
  }[];
}

// Загружаем категории
export const getCategories = (): Category[] => {
  console.log('=== CATEGORIES DEBUG ===');
  console.log('categoriesData:', categoriesData);
  console.log('categoriesData type:', typeof categoriesData);
  console.log('categoriesData length:', Array.isArray(categoriesData) ? categoriesData.length : 'not array');
  console.log('categoriesData[0]:', Array.isArray(categoriesData) ? categoriesData[0] : 'not array');
  console.log('========================');
  return categoriesData as Category[];
};

// Загружаем все товары
export const getMenuItems = (): MenuItem[] => {
  console.log('=== DATA_LOADER DEBUG ===');
  console.log('menuItemsData:', menuItemsData);
  console.log('Первые 3 элемента:', menuItemsData.slice(0, 3));
  console.log('Тип данных:', typeof menuItemsData);
  console.log('Длина массива:', menuItemsData.length);
  
  const result = (menuItemsData as any[]).map(item => ({
    ...item,
    size: item.size || item.weight || 'one size',
    stock: item.stock || 0
  })) as MenuItem[];
  
  console.log('Результат после обработки:', result.slice(0, 3));
  console.log('========================');
  
  return result;
};

// Загружаем все теги
export const getTags = (): Tag[] => {
  http://localhost:4173/miniapp/clothing_store  console.log('=== TAGS DEBUG ===');
  console.log('tagsData:', tagsData);
  console.log('tagsData type:', typeof tagsData);
  console.log('tagsData length:', Array.isArray(tagsData) ? tagsData.length : 'not array');
  console.log('tagsData[0]:', Array.isArray(tagsData) ? tagsData[0] : 'not array');
  console.log('========================');
  return tagsData as Tag[];
};

// Получаем тег по ID
export const getTagById = (id: number): Tag | undefined => {
  return getTags().find(tag => tag.id === id);
};

// Получаем теги для товара
export const getTagsForItem = (itemId: number): Tag[] => {
  const item = getMenuItemById(itemId);
  if (!item) return [];
  
  return item.tags
    .map(tagId => getTagById(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
};

// Загружаем товар по ID
export const getMenuItemById = (id: number): MenuItem | undefined => {
  return getMenuItems().find(item => item.id === id);
};

// Загружаем товары по категории
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return getMenuItems().filter(item => item.category === category);
};

// Получаем добавки для конкретного товара
export const getAddonsForItem = (itemId: number): Addon[] => {
  const item = getMenuItemById(itemId);
  return item?.addons || [];
};

// Получаем все добавки
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

// Получаем рекомендуемые товары для конкретного товара
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

// Функция для загрузки прошлых заказов
export const getPastOrders = async (): Promise<PastOrder[]> => {
  try {
    const response = await fetch('/data/pastOrders.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки прошлых заказов:', error);
    return [];
  }
}; 