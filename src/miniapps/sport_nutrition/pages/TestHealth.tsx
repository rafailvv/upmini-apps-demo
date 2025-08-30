import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TestHealth: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>Тестовая страница здоровья</h1>
      <p>Если вы видите эту страницу, значит роутинг работает!</p>
      <button 
        onClick={() => navigate('/miniapp/sport-nutrition/profile')}
        style={{
          padding: '10px 20px',
          background: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Вернуться к профилю
      </button>
    </div>
  );
};
