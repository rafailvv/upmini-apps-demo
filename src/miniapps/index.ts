import { todoAppConfig } from './todo-app';
import { calculatorAppConfig } from './calculator';
import { weatherAppConfig } from './weather';
import { notesAppConfig } from './notes';
import { menuAppConfig } from './menu';
import { miniappRegistry } from '../utils/miniappRegistry';
import { clothingStoreAppConfig } from './clothing_store';
import { booksStoreAppConfig } from './books_store';
import { sportNutritionAppConfig } from './sport_nutrition';
import { custDevAppConfig } from './cust_dev';

// Регистрируем все мини-приложения
miniappRegistry.register(todoAppConfig);
miniappRegistry.register(calculatorAppConfig);
miniappRegistry.register(weatherAppConfig);
miniappRegistry.register(notesAppConfig);
miniappRegistry.register(menuAppConfig);
miniappRegistry.register(clothingStoreAppConfig);
miniappRegistry.register(booksStoreAppConfig);
miniappRegistry.register(sportNutritionAppConfig);
miniappRegistry.register(custDevAppConfig);

export {
  todoAppConfig,
  calculatorAppConfig,
  weatherAppConfig,
  notesAppConfig,
  menuAppConfig,
  clothingStoreAppConfig,
  booksStoreAppConfig,
  sportNutritionAppConfig,
  custDevAppConfig,
}; 