import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { miniappRegistry } from '../utils/miniappRegistry';

export const MiniappRouter: React.FC = () => {
  const { miniappName } = useParams();
  const miniapp = miniappRegistry.get(miniappName || '');

  if (!miniapp) {
    return (
      <div style={{ background: 'red', color: 'white', padding: '20px' }}>
        Мини-приложение "{miniappName}" не найдено
      </div>
    );
  }

  return (
    <Routes>
      {miniapp.pages.map((page) => {
        const Component = page.component;
        return (
          <Route
            key={page.path}
            path={page.path}
            element={<Component />}
          />
        );
      })}
      {/* Редирект на первую страницу, если путь не найден */}
      <Route
        path="*"
        element={<Navigate to="" replace />}
      />
    </Routes>
  );
}; 