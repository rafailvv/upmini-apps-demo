// Определение платформы
export function isDesktop(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
}

// Определение Telegram MiniApp
export function isTelegramMiniApp(): boolean {
  return typeof window !== 'undefined' && 
         !!window.Telegram && 
         !!window.Telegram.WebApp && 
         !isDesktop();
}

// Инициализация Telegram MiniApp
export function initTelegramMiniApp(): void {
  if (isTelegramMiniApp() && window.Telegram?.WebApp) {
    console.log('Telegram MiniApp detected');
    
    // Добавляем класс для стилизации
    document.body.classList.add('telegram-miniapp');
    
    // Запрашиваем полноэкранный режим
    window.Telegram.WebApp.requestFullscreen();
    
    // Показываем кнопку "Назад"
    window.Telegram.WebApp.BackButton.show();
    
    // Обработчик кнопки "Назад"
    window.Telegram.WebApp.BackButton.onClick(() => {
      window.history.back();
    });
    
    // Добавляем отступ для хедера
    const header = document.querySelector('.header');
    if (header) {
      (header as HTMLElement).style.marginTop = '90px';
    }
  }
}

// Добавление отступа для всех страниц в Telegram MiniApp
export function addTelegramHeaderOffset(): void {
  if (isTelegramMiniApp()) {
    // Добавляем класс для стилизации
    document.body.classList.add('telegram-miniapp');
    
    const headers = document.querySelectorAll('.menu-header, .detail-header');
    headers.forEach(header => {
      (header as HTMLElement).style.marginTop = '90px';
    });
  }
}

// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        requestFullscreen: () => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
} 