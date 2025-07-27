import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MiniappConfig } from '../types/miniapp';
import '../styles/layout.css';

interface MiniappLayoutProps {
  miniapp: MiniappConfig;
  children: React.ReactNode;
}

export const MiniappLayout: React.FC<MiniappLayoutProps> = ({ miniapp, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate('/');
  };

  const handlePageChange = (path: string) => {
    if (path === '') {
      navigate(`/miniapp/${miniapp.name}`);
    } else {
      navigate(`/miniapp/${miniapp.name}/${path}`);
    }
  };

  return (
    <div className="miniapp-layout">
      
      {/* Header */}
      <header className="miniapp-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button">
            ← Назад
          </button>
          <div className="miniapp-info">
            <h1>{miniapp.title}</h1>
            <p>{miniapp.description}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="miniapp-nav">
        {miniapp.pages.map((page) => (
          <button
            key={page.path}
            onClick={() => handlePageChange(page.path)}
            className={`nav-button ${
              location.pathname === `/miniapp/${miniapp.name}${page.path}` ? 'active' : ''
            }`}
          >
            {page.title}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="miniapp-content">
        {children}
      </main>
    </div>
  );
}; 