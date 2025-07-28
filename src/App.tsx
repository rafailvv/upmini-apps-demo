// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { MiniappRouter } from './components/MiniappRouter';
import { initTelegramMiniApp, addTelegramHeaderOffset } from './utils/telegramUtils';
import './App.css';

// Импортируем мини-приложения для их регистрации
import './miniapps';

function App() {
  useEffect(() => {
    // Инициализируем Telegram MiniApp с задержкой для надежности
    const initTelegram = () => {
      try {
        console.log('App: Initializing Telegram MiniApp...');
        initTelegramMiniApp();
        addTelegramHeaderOffset();
      } catch (error) {
        console.error('App: Error initializing Telegram:', error);
      }
    };

    // Запускаем инициализацию сразу и с небольшой задержкой
    initTelegram();
    
    // Дополнительная инициализация через 100ms для надежности
    const timeoutId = setTimeout(initTelegram, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/miniapp/:miniappName/*" element={<MiniappRouter />} />
          {/* Редирект на главную страницу для неизвестных маршрутов */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
