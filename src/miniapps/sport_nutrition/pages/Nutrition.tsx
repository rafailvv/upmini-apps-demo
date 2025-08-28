import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();

  const meals = [
    {
      id: 1,
      name: 'Завтрак',
      description: 'Овсянка с фруктами и орехами',
      calories: '350 ккал',
      time: '08:00'
    },
    {
      id: 2,
      name: 'Обед',
      description: 'Куриная грудка с овощами',
      calories: '450 ккал',
      time: '13:00'
    },
    {
      id: 3,
      name: 'Ужин',
      description: 'Лосось с киноа',
      calories: '400 ккал',
      time: '19:00'
    }
  ];

  return (
    <div className="schedule-container">
      {/* Заголовок */}
      <div className="schedule-header">
        <h1>Питание</h1>
      </div>

      {/* Список приемов пищи */}
      <div className="plans-list" style={{ top: '300px' }}>
        {meals.map((meal) => (
          <div key={meal.id} className="plan-card">
            <div className="plan-content">
              <h4>{meal.name}</h4>
              <p>{meal.description}</p>
            </div>
            <div className="class-info">
              <div className="class-time">{meal.time}</div>
              <div className="class-location">{meal.calories}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
