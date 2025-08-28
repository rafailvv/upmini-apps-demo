import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  muscleGroup: string;
  image: string;
  completed: boolean;
}

export const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: 'Приседания',
      sets: 3,
      reps: '12 повторений',
      weight: '20 кг',
      muscleGroup: 'Большая ягодичная',
      image: '/images/squat.jpg',
      completed: true
    },
    {
      id: 2,
      name: 'Планка',
      sets: 3,
      reps: '60 секунд',
      weight: 'нет',
      muscleGroup: 'Пресс',
      image: '/images/plank.jpg',
      completed: false
    }
  ]);

  const [comments, setComments] = useState<{ [key: number]: string }>({});

  const toggleExerciseCompletion = (exerciseId: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, completed: !exercise.completed }
        : exercise
    ));
  };

  const handleCommentChange = (exerciseId: number, comment: string) => {
    setComments(prev => ({
      ...prev,
      [exerciseId]: comment
    }));
  };

  const completedCount = exercises.filter(exercise => exercise.completed).length;

  return (
    <div className="workouts-container">
      {/* Основной контент */}
      <div className="workouts-header">
        <h1>Тренировки</h1>
        <div className="progress-indicator">Выполнено: {completedCount}/{exercises.length}</div>
      </div>

      {/* Список упражнений */}
      <div className="exercises-list">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-section">
            {/* Карточка упражнения */}
            <div className="exercise-card" onClick={() => toggleExerciseCompletion(exercise.id)}>
              {/* Изображение упражнения */}
              <div className="exercise-image">
                <div className="play-button">▶</div>
              </div>

              {/* Детали упражнения */}
              <div className="exercise-details">
                <h3>{exercise.name}</h3>
                <div className="exercise-stats">
                  {exercise.sets} подхода {exercise.reps}
                </div>
                <div className="exercise-info">
                  Вес: {exercise.weight} {exercise.muscleGroup}
                </div>
              </div>

              {/* Индикатор выполнения */}
              <div 
                className={`completion-indicator ${exercise.completed ? 'completed' : ''}`}
              ></div>
            </div>

            {/* Поле комментария */}
            <div className="comment-field">
              <input
                type="text"
                placeholder="Комментарий к упражнению"
                value={comments[exercise.id] || ''}
                onChange={(e) => handleCommentChange(exercise.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка завершения тренировки */}
      <button className="complete-workout-btn">
        <span>Завершить тренировку</span>
      </button>
    </div>
  );
};
