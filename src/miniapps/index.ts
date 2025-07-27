import { todoAppConfig } from './todo-app';
import { calculatorAppConfig } from './calculator';
import { weatherAppConfig } from './weather';
import { notesAppConfig } from './notes';
import { menuAppConfig } from './menu';
import { miniappRegistry } from '../utils/miniappRegistry';

// Регистрируем все мини-приложения
miniappRegistry.register(todoAppConfig);
miniappRegistry.register(calculatorAppConfig);
miniappRegistry.register(weatherAppConfig);
miniappRegistry.register(notesAppConfig);
miniappRegistry.register(menuAppConfig);

export {
  todoAppConfig,
  calculatorAppConfig,
  weatherAppConfig,
  notesAppConfig,
  menuAppConfig,
}; 