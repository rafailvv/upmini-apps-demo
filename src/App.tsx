import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { initTelegramMiniApp, addTelegramHeaderOffset } from './utils/telegramUtils';
import './App.css';
import Survey from './miniapps/cust_dev/pages/Survey';
import { finishStartup, setStartupStage } from './utils/startupLoader';

const DemoRoutes = lazy(() => import('./components/DemoRoutes'));

function StartupReady() {
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      setStartupStage(3);
      frame = requestAnimationFrame(finishStartup);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}

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
  }, []);

  return (
    <Router>
      <div className="App">
        <Suspense fallback={null}>
          <Routes>
            {window.location.hostname === 'quiz.miniapp.upmini.app' && <Route path="/" element={<Survey />} />}
            <Route path="*" element={<DemoRoutes />} />
          </Routes>
          <StartupReady />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
