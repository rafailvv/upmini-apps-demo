// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { MiniappRouter } from './components/MiniappRouter';
import { initTelegramMiniApp, addTelegramHeaderOffset } from './utils/telegramUtils';
import './App.css';
import { finishStartup, setStartupStage } from './utils/startupLoader';

// Импортируем мини-приложения для их регистрации
import './miniapps';

function App() {
  useEffect(() => {
    // Инициализируем Telegram MiniApp с задержкой для надежности
    const initTelegram = () => {
      try {
        setStartupStage(1);
        console.log('App: Initializing Telegram MiniApp...');
        initTelegramMiniApp();
        addTelegramHeaderOffset();
        setStartupStage(2);
      } catch (error) {
        console.error('App: Error initializing Telegram:', error);
      }
    };

    // Инициализируем один раз: повторный запуск создавал дублирующиеся Telegram-обработчики.
    initTelegram();
    const readyFrame = requestAnimationFrame(() => {
      setStartupStage(3);
      requestAnimationFrame(finishStartup);
    });
    
    return () => {
      cancelAnimationFrame(readyFrame);
    };
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
