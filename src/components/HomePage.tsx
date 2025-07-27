import React from 'react';
import { useNavigate } from 'react-router-dom';
import { miniappRegistry } from '../utils/miniappRegistry';
import '../styles/home.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const miniapps = miniappRegistry.getAll();

  const handleMiniappClick = (miniappName: string) => {
    navigate(`/miniapp/${miniappName}`);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Telegram Mini Apps Demo</h1>
        <p>Выберите мини-приложение для тестирования</p>
      </header>

      <div className="miniapps-grid">
        {miniapps.map((miniapp) => (
          <div
            key={miniapp.name}
            className="miniapp-card"
            onClick={() => handleMiniappClick(miniapp.name)}
            style={{ borderColor: miniapp.color }}
          >
            <div className="miniapp-icon" style={{ backgroundColor: miniapp.color }}>
              {miniapp.icon || '📱'}
            </div>
            <div className="miniapp-info">
              <h3>{miniapp.title}</h3>
              <p>{miniapp.description}</p>
              <span className="pages-count">{miniapp.pages.length} страниц</span>
            </div>
          </div>
        ))}
      </div>

      {miniapps.length === 0 && (
        <div className="empty-state">
          <p>Мини-приложения не найдены</p>
        </div>
      )}
    </div>
  );
}; 