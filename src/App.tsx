import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { MiniappRouter } from './components/MiniappRouter';
import './App.css';

// Импортируем мини-приложения для их регистрации
import './miniapps';

function App() {
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
