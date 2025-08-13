import { todoAppConfig } from './todo-app';
import { calculatorAppConfig } from './calculator';
import { weatherAppConfig } from './weather';
import { notesAppConfig } from './notes';
import { menuAppConfig } from './menu';
import { miniappRegistry } from '../utils/miniappRegistry';
import { clothingStoreAppConfig } from './clothing_store';

// Регистрируем все мини-приложения
miniappRegistry.register(todoAppConfig);
miniappRegistry.register(calculatorAppConfig);
miniappRegistry.register(weatherAppConfig);
miniappRegistry.register(notesAppConfig);
miniappRegistry.register(menuAppConfig);
miniappRegistry.register(clothingStoreAppConfig);

export {
  todoAppConfig,
  calculatorAppConfig,
  weatherAppConfig,
  notesAppConfig,
  menuAppConfig,
  clothingStoreAppConfig,
}; 