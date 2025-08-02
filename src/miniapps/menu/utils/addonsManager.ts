export interface Addon {
  id: number;
  name: string;
  price: number;
  available?: boolean; // для управления доступностью
  itemIds?: number[]; // для каких товаров доступна эта добавка (пустой массив = для всех)
}

// Универсальный реестр добавок
class AddonsRegistry {
  private addons: Map<number, Addon> = new Map();

  // Регистрируем добавку
  registerAddon(addon: Addon) {
    this.addons.set(addon.id, addon);
  }

  // Регистрируем несколько добавок
  registerAddons(addons: Addon[]) {
    addons.forEach(addon => this.registerAddon(addon));
  }

  // Получаем добавку по ID
  getAddon(id: number): Addon | undefined {
    return this.addons.get(id);
  }

  // Получаем все добавки
  getAllAddons(): Addon[] {
    return Array.from(this.addons.values());
  }

  // Получаем добавки для конкретного товара
  getAddonsForItem(itemId: number): Addon[] {
    return Array.from(this.addons.values()).filter(addon => {
      // Если available = false, исключаем
      if (addon.available === false) return false;
      
      // Если itemIds не указан или пустой, добавка доступна для всех товаров
      if (!addon.itemIds || addon.itemIds.length === 0) return true;
      
      // Иначе проверяем, есть ли товар в списке
      return addon.itemIds.includes(itemId);
    });
  }

  // Получаем доступные добавки
  getAvailableAddons(): Addon[] {
    return Array.from(this.addons.values()).filter(addon => addon.available !== false);
  }

  // Рассчитываем цену добавок
  calculateAddonsPrice(selectedAddonIds: number[]): number {
    return selectedAddonIds
      .map(id => this.getAddon(id))
      .filter(addon => addon !== undefined)
      .reduce((sum, addon) => sum + (addon?.price || 0), 0);
  }

  // Получаем названия добавок
  getAddonNames(selectedAddonIds: number[]): string[] {
    return selectedAddonIds
      .map(id => this.getAddon(id))
      .filter(addon => addon !== undefined)
      .map(addon => addon!.name);
  }
}

// Создаем глобальный экземпляр реестра
export const addonsRegistry = new AddonsRegistry();

// Инициализируем добавки для разных товаров
addonsRegistry.registerAddons([
  // Добавки для пасты (товары 1, 2, 5, 6, 7, 8, 9, 10, 11, 12)
  { id: 1, name: 'Поджаренный хлеб', price: 50, itemIds: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: 2, name: 'Дополнительный соус', price: 100, itemIds: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: 3, name: 'Сырная добавка', price: 60, itemIds: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12] },
  
  // Добавки для стейка (товар 3)
  { id: 4, name: 'Овощи гриль', price: 80, itemIds: [3] },
  { id: 5, name: 'Мясная добавка', price: 150, itemIds: [3] },
  { id: 6, name: 'Специи', price: 30, itemIds: [3] },
  
  // Добавки для салата (товар 4)
  { id: 7, name: 'Дополнительные овощи', price: 40, itemIds: [4] },
  { id: 8, name: 'Сыр пармезан', price: 90, itemIds: [4] },
  { id: 9, name: 'Сухарики', price: 20, itemIds: [4] },
  
  // Добавки для закусок (товары 13-18)
  { id: 10, name: 'Соус для закусок', price: 50, itemIds: [13, 14, 15, 16, 17, 18] },
  { id: 11, name: 'Специи для закусок', price: 25, itemIds: [13, 14, 15, 16, 17, 18] },
  
  // Добавки для десертов (товары 19-24)
  { id: 12, name: 'Сливки', price: 40, itemIds: [19, 20, 21, 22, 23, 24] },
  { id: 13, name: 'Сахарная пудра', price: 15, itemIds: [19, 20, 21, 22, 23, 24] },
  
  // Добавки для напитков (товары 25-30)
  { id: 14, name: 'Лед', price: 10, itemIds: [25, 26, 27, 28, 29, 30] },
  { id: 15, name: 'Лимон', price: 20, itemIds: [25, 26, 27, 28, 29, 30] },
]);

// Примеры того, как легко добавлять новые добавки:
// addonsRegistry.registerAddon({ id: 16, name: 'Грибы', price: 70, itemIds: [1, 2] });
// addonsRegistry.registerAddon({ id: 17, name: 'Бекон', price: 120, itemIds: [3, 4] });

// Примеры того, как управлять доступностью добавок:
// const cheeseAddon = addonsRegistry.getAddon(3);
// if (cheeseAddon) {
//   cheeseAddon.available = false; // временно недоступно
// }

// Экспортируем функции для удобства
export const getAddon = (id: number) => addonsRegistry.getAddon(id);
export const getAllAddons = () => addonsRegistry.getAllAddons();
export const getAddonsForItem = (itemId: number) => addonsRegistry.getAddonsForItem(itemId);
export const getAvailableAddons = () => addonsRegistry.getAvailableAddons();
export const calculateAddonsPrice = (selectedAddonIds: number[]) => addonsRegistry.calculateAddonsPrice(selectedAddonIds);
export const getAddonNames = (selectedAddonIds: number[]) => addonsRegistry.getAddonNames(selectedAddonIds); 