import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface CompletedWorkout {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  originalPlannedDay?: number;
  originalPlannedMonth?: number;
  originalPlannedYear?: number;
}

const WorkoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [workoutNumbers, setWorkoutNumbers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const savedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    if (savedCompletedWorkouts) {
      try {
        const workouts = JSON.parse(savedCompletedWorkouts);
        const validWorkouts = Array.isArray(workouts) ? workouts : [];
        setCompletedWorkouts(validWorkouts);
        
        // Группируем тренировки по дате и создаем нумерацию
        // Если несколько тренировок в один день - добавляем подпункты (1_1, 1_2, etc.)
        const workoutGroups: { [key: string]: number } = {};
        const numbers: { [key: number]: string } = {};
        let currentGroupNumber = 1;
        
        validWorkouts.forEach((workout, index) => {
          const dateKey = new Date(workout.date).toDateString();
          
          if (workoutGroups[dateKey]) {
            workoutGroups[dateKey]++;
            numbers[index] = `${currentGroupNumber}_${workoutGroups[dateKey]}`;
          } else {
            workoutGroups[dateKey] = 1;
            numbers[index] = `${currentGroupNumber}`;
            currentGroupNumber++;
          }
        });
        
        setWorkoutNumbers(numbers);
      } catch (error) {
        console.error('Error parsing workout data:', error);
        setCompletedWorkouts([]);
        setWorkoutNumbers({});
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isWorkoutMoved = (workout: CompletedWorkout) => {
    return workout.originalPlannedDay !== undefined && 
           workout.originalPlannedMonth !== undefined && 
           workout.originalPlannedYear !== undefined;
  };

  return (
    <div className="workout-history-container">
      <header className="history-header">
        <h1>История тренировок</h1>
      </header>

      <main className="history-main">
        {completedWorkouts.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">💪</div>
            <h2>История тренировок пуста</h2>
            <p>Выполненные тренировки появятся здесь</p>
            <button 
              className="start-workout-btn"
              onClick={() => navigate('workouts')}
            >
              Начать тренировку
            </button>
          </div>
        ) : (
          <div className="workout-history-list">
            {completedWorkouts.map((workout, index) => (
              <div 
                key={index} 
                className={`workout-history-item ${isWorkoutMoved(workout) ? 'moved' : ''}`}
                onClick={() => {
                  // Навигация к детальному просмотру тренировки
                  navigate('workouts', { 
                    state: { 
                      selectedWorkout: workout,
                      fromHistory: true 
                    } 
                  });
                }}
              >
                <div className="workout-history-info">
                  <div className="workout-history-header">
                    <h3>Тренировка #{workoutNumbers[index] || (completedWorkouts.length - index)}</h3>
                    <span className="workout-date">{formatDate(workout.date)}</span>
                  </div>
                  
                  <div className="workout-stats">
                    <div className="stat-item">
                      <span className="stat-label">Выполнено:</span>
                      <span className="stat-value">
                        {workout.completedCount || 0}/{workout.totalCount || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Процент:</span>
                      <span className="stat-value">{workout.percentage || 0}%</span>
                    </div>
                  </div>

                  {isWorkoutMoved(workout) && workout.originalPlannedDay && (
                    <div className="moved-indicator">
                      <span className="moved-icon">↔</span>
                      <span className="moved-text">
                        Перенесена с {workout.originalPlannedDay} {new Date(workout.date).toLocaleDateString('ru-RU', { month: 'long' })}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="workout-badge">
                  <span className="badge-icon">💪</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { WorkoutHistory };