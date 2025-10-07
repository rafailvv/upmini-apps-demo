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

// Настройка кнопки "Закрыть" для страницы Survey
export function setupSurveyCloseButton(): void {
  if (isTelegramMiniApp() && window.Telegram?.WebApp) {
    console.log('Setting up Survey close button');
    
    // Показываем кнопку "Закрыть" для страницы Survey
    window.Telegram.WebApp.BackButton.show();
    
    // Обработчик кнопки "Закрыть"
    window.Telegram.WebApp.BackButton.onClick(() => {
      console.log('Survey close button clicked - closing MiniApp');
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    });
  }
}

// Управление кнопкой "Назад" в Telegram MiniApp
export function setupTelegramBackButton(): void {
  if (isTelegramMiniApp() && window.Telegram?.WebApp) {
    // Проверяем состояние кнопки при изменении истории
    const checkBackButtonState = () => {
      const currentPath = window.location.pathname;
      console.log('Checking back button state for path:', currentPath);
      
      // Проверяем, находимся ли мы на странице Survey
      const isSurveyPage = currentPath.includes('/cust_dev') || currentPath.includes('/survey');
      
      if (currentPath === '/' || currentPath === '/miniapp/menu') {
        // Если мы на главной странице или в меню, скрываем кнопку "Назад"
        console.log('On main page - hiding back button, showing close button');
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.BackButton.hide();
        }
      } else if (isSurveyPage) {
        // На странице Survey показываем кнопку "Закрыть"
        console.log('On survey page - showing close button');
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.BackButton.show();
        }
      } else {
        // Иначе показываем кнопку "Назад"
        console.log('On sub-page - showing back button');
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.BackButton.show();
        }
      }
    };
    
    // Обработчик кнопки "Назад"
    window.Telegram.WebApp.BackButton.onClick(() => {
      console.log('Back button clicked');
      console.log('Current history length:', window.history.length);
      console.log('Current pathname:', window.location.pathname);
      
      // Проверяем текущий путь
      const currentPath = window.location.pathname;
      const isSurveyPage = currentPath.includes('/cust_dev') || currentPath.includes('/survey');
      
      if (currentPath === '/' || currentPath === '/miniapp/menu' || isSurveyPage) {
        // Если мы на главной странице, в меню или на странице Survey, закрываем MiniApp
        console.log('Closing MiniApp - on main page or survey');
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.close();
        }
      } else {
        // Иначе возвращаемся назад
        console.log('Going back in history');
        window.history.back();
      }
    });
    
    // Проверяем состояние при загрузке
    checkBackButtonState();
    
    // Слушаем изменения истории
    window.addEventListener('popstate', checkBackButtonState);
    
    // Слушаем изменения пути
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkBackButtonState, 100);
    };
  }
}

// Сохранение данных пользователя из Telegram в localStorage
export function saveTelegramUserData(): void {
  console.log('=== SAVE TELEGRAM USER DATA ===');
  console.log('isTelegramMiniApp():', isTelegramMiniApp());
  console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
  console.log('window.Telegram?.WebApp?.initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
  console.log('window.Telegram?.WebApp?.initDataUnsafe?.user:', window.Telegram?.WebApp?.initDataUnsafe?.user);
  
  if (isTelegramMiniApp() && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    console.log('Raw user data from Telegram:', user);
    
    const userData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      photoUrl: user.photo_url,
      isBot: user.is_bot
    };
    
    console.log('Processed user data:', userData);
    
    // Сохраняем данные пользователя в localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data saved to localStorage:', userData);
    
    // Проверяем, что данные действительно сохранились
    const savedData = localStorage.getItem('userData');
    console.log('Verification - saved data from localStorage:', savedData);
  } else {
    console.log('No Telegram user data available');
  }
  console.log('================================');
}

// Инициализация Telegram MiniApp
export function initTelegramMiniApp(): void {
  console.log('Initializing Telegram MiniApp...');
  
  if (isTelegramMiniApp() && window.Telegram?.WebApp) {
    console.log('Telegram MiniApp detected and initializing');
    
    try {
      // Сообщаем Telegram, что приложение готово
      window.Telegram.WebApp.ready();
      console.log('Telegram WebApp ready called');
      
      // Сохраняем данные пользователя
      saveTelegramUserData();
      
      // Добавляем класс для стилизации
      document.body.classList.add('telegram-miniapp');
      
      // Запрашиваем полноэкранный режим
      window.Telegram.WebApp.requestFullscreen();
      console.log('Fullscreen requested');
      
      // Настраиваем кнопку "Назад"
      setupTelegramBackButton();
      
      // Добавляем отступ для хедера
      const header = document.querySelector('.header');
      if (header) {
        (header as HTMLElement).style.marginTop = '90px';
        console.log('Header margin added');
      }
      
      // Логируем информацию о пользователе
      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        console.log('User info:', window.Telegram.WebApp.initDataUnsafe.user);
      }
      
      console.log('Telegram WebApp version:', window.Telegram.WebApp.version);
      console.log('Telegram WebApp platform:', window.Telegram.WebApp.platform);
      
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
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          receiver: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
          chat: {
            id: number;
            type: string;
            title?: string;
            username?: string;
            first_name?: string;
            last_name?: string;
          };
          chat_type: string;
          chat_instance: string;
          start_param?: string;
          can_send_after: number;
          auth_date: number;
          hash: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }) => void;
          alert: (message: string) => void;
          confirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        requestFullscreen: () => void;
        requestViewport: () => void;
        isVersionAtLeast: (version: string) => boolean;
        platform: string;
        version: string;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: { text?: string }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (data: string | null) => void) => void;
        requestWriteAccess: (callback?: (access: boolean) => void) => void;
        requestContact: (callback?: (contact: { phone_number: string; first_name: string; last_name?: string; user_id?: number } | null) => void) => void;
        invokeCustomMethod: (method: string, params?: any, callback?: (result: any) => void) => void;
        invokeCustomMethodAsync: (method: string, params?: any) => Promise<any>;
        onEvent: (eventType: string, eventHandler: (event: any) => void) => void;
        offEvent: (eventType: string, eventHandler: (event: any) => void) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onClosingConfirmation: (callback: () => void) => void;
        offClosingConfirmation: (callback: () => void) => void;
      };
    };
  }
} 