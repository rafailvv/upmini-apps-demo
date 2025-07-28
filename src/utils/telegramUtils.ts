// Определение платформы
export function isDesktop(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("windows") || userAgent.includes("macintosh") || userAgent.includes("linux");
}

// Определение Telegram MiniApp
export function isTelegramMiniApp(): boolean {
  console.log('Checking Telegram MiniApp...');
  console.log('User Agent:', navigator.userAgent);
  console.log('Window Telegram:', window.Telegram);
  console.log('Window Telegram WebApp:', window.Telegram?.WebApp);
  
  const isTelegram = typeof window !== 'undefined' && 
         !!window.Telegram && 
         !!window.Telegram.WebApp;
  
  const isMobile = !isDesktop();
  
  console.log('Is Telegram:', isTelegram);
  console.log('Is Mobile:', isMobile);
  console.log('Is Telegram MiniApp:', isTelegram && isMobile);
  
  return isTelegram && isMobile;
}

// Инициализация Telegram MiniApp
export function initTelegramMiniApp(): void {
  console.log('Initializing Telegram MiniApp...');
  
  if (isTelegramMiniApp() && window.Telegram?.WebApp) {
    console.log('Telegram MiniApp detected and initializing');
    
    try {
      // Добавляем класс для стилизации
      document.body.classList.add('telegram-miniapp');
      
      // Запрашиваем полноэкранный режим
      window.Telegram.WebApp.requestFullscreen();
      console.log('Fullscreen requested');
      
      // Показываем кнопку "Назад"
      window.Telegram.WebApp.BackButton.show();
      console.log('Back button shown');
      
      // Обработчик кнопки "Назад"
      window.Telegram.WebApp.BackButton.onClick(() => {
        console.log('Back button clicked');
        window.history.back();
      });
      
      // Добавляем отступ для хедера
      const header = document.querySelector('.header');
      if (header) {
        (header as HTMLElement).style.marginTop = '90px';
        console.log('Header margin added');
      }
    } catch (error) {
      console.error('Error initializing Telegram MiniApp:', error);
    }
  } else {
    console.log('Not in Telegram MiniApp environment');
  }
}

// Добавление отступа для всех страниц в Telegram MiniApp
export function addTelegramHeaderOffset(): void {
  console.log('Adding Telegram header offset...');
  
  if (isTelegramMiniApp()) {
    console.log('Adding telegram-miniapp class and offsets');
    
    // Добавляем класс для стилизации
    document.body.classList.add('telegram-miniapp');
    
    const headers = document.querySelectorAll('.menu-header, .detail-header');
    headers.forEach(header => {
      (header as HTMLElement).style.marginTop = '90px';
    });
    
    console.log('Headers updated:', headers.length);
  } else {
    console.log('Not in Telegram MiniApp, skipping header offsets');
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