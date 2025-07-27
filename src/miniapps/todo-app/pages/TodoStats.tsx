import React from 'react';
import '../styles.css';

export const TodoStats: React.FC = () => {
  // В реальном приложении данные будут приходить из контекста или пропсов
  const mockStats = {
    total: 15,
    completed: 8,
    pending: 7,
    thisWeek: 5,
    thisMonth: 12,
  };

  const completionRate = Math.round((mockStats.completed / mockStats.total) * 100);

  return (
    <div className="todo-stats-page">
      <h2>Статистика задач</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего задач</h3>
          <div className="stat-number">{mockStats.total}</div>
        </div>
        
        <div className="stat-card">
          <h3>Выполнено</h3>
          <div className="stat-number completed">{mockStats.completed}</div>
        </div>
        
        <div className="stat-card">
          <h3>В процессе</h3>
          <div className="stat-number pending">{mockStats.pending}</div>
        </div>
        
        <div className="stat-card">
          <h3>Процент выполнения</h3>
          <div className="stat-number">{completionRate}%</div>
        </div>
      </div>

      <div className="progress-section">
        <h3>Прогресс выполнения</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p>{completionRate}% задач выполнено</p>
      </div>

      <div className="recent-activity">
        <h3>Недавняя активность</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <span>Задача "Изучить React" выполнена</span>
            <span className="activity-time">2 часа назад</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">➕</span>
            <span>Добавлена новая задача</span>
            <span className="activity-time">Вчера</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📝</span>
            <span>Обновлена задача "Создать мини-приложение"</span>
            <span className="activity-time">3 дня назад</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 