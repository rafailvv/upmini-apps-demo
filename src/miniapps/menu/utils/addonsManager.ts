// Этот файл теперь устарел, так как данные загружаются из JSON файлов
// Все функции перенесены в dataLoader.ts

export interface Addon {
  id: number;
  name: string;
  price: number;
  available?: boolean;
  itemIds?: number[];
}

// Экспортируем функции из dataLoader для обратной совместимости
export { 
  getAddonsForItem, 
  calculateAddonsPrice, 
  getAddonNames 
} from './dataLoader'; 