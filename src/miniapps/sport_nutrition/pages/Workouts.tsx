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

interface CompletedWorkout {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  originalPlannedDay?: number;
  originalPlannedMonth?: number;
  originalPlannedYear?: number;
}

export const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
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

  const handleCompleteWorkout = () => {
    setShowCompletionModal(true);
  };

  const handleConfirmCompletion = () => {
    setWorkoutCompleted(true);
    setShowCompletionModal(false);
    
    // Получаем информацию о запланированном дне
    const plannedWorkoutDay = localStorage.getItem('plannedWorkoutDay');
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Создаем данные о завершенной тренировке
    const workoutData = {
      date: currentDate.toISOString(),
      exercises: exercises,
      completedCount: completedCount,
      totalCount: exercises.length,
      percentage: Math.round((completedCount / exercises.length) * 100)
    };
    
    // Сохраняем информацию о последней завершенной тренировке
    localStorage.setItem('lastCompletedWorkout', JSON.stringify(workoutData));
    
    // Сохраняем в массив всех выполненных тренировок
    const existingCompletedWorkouts = localStorage.getItem('completedWorkouts');
    const completedWorkouts = existingCompletedWorkouts ? JSON.parse(existingCompletedWorkouts) : [];
    
    // Добавляем новую тренировку в массив
    const newCompletedWorkout: CompletedWorkout = {
      date: currentDate.toISOString(),
      completedCount: completedCount,
      totalCount: exercises.length,
      percentage: Math.round((completedCount / exercises.length) * 100)
    };
    
    // Проверяем, была ли тренировка перенесена на другой день
    if (plannedWorkoutDay) {
      const planned = JSON.parse(plannedWorkoutDay);
      if (planned.day !== currentDay || planned.month !== currentMonth || planned.year !== currentYear) {
        // Тренировка была перенесена - добавляем информацию об объединении
        newCompletedWorkout.originalPlannedDay = planned.day;
        newCompletedWorkout.originalPlannedMonth = planned.month;
        newCompletedWorkout.originalPlannedYear = planned.year;
      }
    }
    
    completedWorkouts.push(newCompletedWorkout);
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
    
    // Очищаем информацию о запланированном дне
    localStorage.removeItem('plannedWorkoutDay');
    
    navigate('/miniapp/sport-nutrition');
  };

  const handleCancelCompletion = () => {
    setShowCompletionModal(false);
  };

  const completedCount = exercises.filter(exercise => exercise.completed).length;

  return (
    <div className="workouts-container">
      {/* Основной контент */}
      <div className="workouts-header">
        <h1>Тренировки</h1>
        <div className={`progress-indicator ${workoutCompleted ? 'completed' : ''}`}>
          Выполнено: <span className="completed-count">{completedCount}</span>/{exercises.length}
        </div>
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
      <button className="complete-workout-btn" onClick={handleCompleteWorkout}>
        <span>Завершить тренировку</span>
      </button>

      {/* Модальное окно завершения тренировки */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={handleCancelCompletion}>
          <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-icon">✅</div>
              <h2>Тренировка завершена!</h2>
              <p>Отличная работа! Вы успешно завершили тренировку.</p>
              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-label">Выполнено упражнений:</span>
                  <span className="stat-value">{completedCount}/{exercises.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Процент выполнения:</span>
                  <span className="stat-value">{Math.round((completedCount / exercises.length) * 100)}%</span>
                </div>
              </div>
              <div className="modal-buttons">
                <button className="modal-btn cancel-btn" onClick={handleCancelCompletion}>
                  Продолжить тренировку
                </button>
                <button className="modal-btn confirm-btn" onClick={handleConfirmCompletion}>
                  Вернуться к расписанию
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
