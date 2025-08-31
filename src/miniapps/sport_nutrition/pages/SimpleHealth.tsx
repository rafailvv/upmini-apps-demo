import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SimpleHealth: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
              <h1 style={{ fontFamily: 'Manrope', color: '#333', fontSize: '28px', textAlign: 'center' }}>
        Страница здоровья
      </h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#666' }}>Хронические заболевания:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button style={{ padding: '10px 20px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '20px' }}>
            нет
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            сердце
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            суставы
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            ЖКТ
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#666' }}>Травмы:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button style={{ padding: '10px 20px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '20px' }}>
            колени
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            спина
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            плечи
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            нет
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#666' }}>Аллергии:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            молочные продукты
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#666' }}>Лекарства:</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button style={{ padding: '10px 20px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '20px' }}>
            витамин D
          </button>
          <button style={{ padding: '10px 20px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '20px' }}>
            омега-3
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/miniapp/sport-nutrition/profile')}
          style={{
            padding: '15px 30px',
            background: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Назад
        </button>
        <button 
          onClick={() => alert('Переход к следующему шагу!')}
          style={{
            padding: '15px 30px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );
};
