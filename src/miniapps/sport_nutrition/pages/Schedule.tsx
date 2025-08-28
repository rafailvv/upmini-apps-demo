import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface DayPlan {
  id: number;
  title: string;
  type: 'workout' | 'nutrition';
  time: string;
}

interface CompletedWorkout {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<any>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);

  // Загружаем информацию о последней завершенной тренировке и всех выполненных тренировках при монтировании компонента
  useEffect(() => {
    const savedWorkout = localStorage.getItem('lastCompletedWorkout');
    if (savedWorkout) {
      setLastCompletedWorkout(JSON.parse(savedWorkout));
    }

    // Загружаем все выполненные тренировки
    const savedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }
  }, []);

  // Функция для проверки, выполнена ли тренировка в определенный день
  const isWorkoutCompleted = (day: number): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    return completedWorkouts.some(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getDate() === day && 
             workoutDate.getMonth() === currentMonth && 
             workoutDate.getFullYear() === currentYear;
    });
  };

  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Дни с запланированными тренировками
  const scheduledWorkouts = [3, 7, 10, 14, 17, 21, 24, 28];

  const handleDateClick = (day: number) => {
    if (scheduledWorkouts.includes(day)) {
      setSelectedDay(selectedDay === day ? null : day);
    }
  };

  const handlePlanClick = (planType: string) => {
    if (planType === 'workout') {
      navigate('workouts');
    } else if (planType === 'nutrition') {
      navigate('nutrition');
    }
  };

  const plans: DayPlan[] = [
    { id: 1, title: 'Тренировки', type: 'workout', time: '09:00' },
    { id: 2, title: 'Питание', type: 'nutrition', time: '10:00' }
  ];

  // Генерация дней месяца (31 день)
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const days = generateDays();

  return (
    <div className="schedule-container">
      <main className="main-content">
        {/* Заголовок и навигация */}
        <header className="header-section">
          <div className="title-container">
            <h1>Моё</h1>
            <h1>расписание</h1>
          </div>
          
          {/* Информация о последней завершенной тренировке */}
          {lastCompletedWorkout && (
            <div className="last-workout-info">
              <div className="workout-badge">
                <span className="workout-icon">💪</span>
                <span className="workout-text">Последняя тренировка</span>
                <span className="workout-date">
                  {new Date(lastCompletedWorkout.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
              <div className="workout-stats">
                <span className="stats-text">Выполнено:</span>
                <span className="completed-exercises">{lastCompletedWorkout.completedCount}</span>
                <span className="total-exercises">/{lastCompletedWorkout.totalCount}</span>
                <span className="percentage">({lastCompletedWorkout.percentage}%)</span>
              </div>
            </div>
          )}

          <nav className="month-navigation">
            {months.map((month, index) => (
              <div key={index} className="month-item">
                <button
                  onClick={() => setSelectedMonth(index)}
                  className={`month-btn ${selectedMonth === index ? 'active' : ''}`}
                >
                  {month}
                </button>
                {selectedMonth === index && (
                  <div className="month-underline"></div>
                )}
              </div>
            ))}
          </nav>
        </header>

        {/* Календарь */}
        <section className="calendar-section">
          {/* Заголовки дней недели */}
          <div className="calendar-header">
            {weekDays.map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Сетка календаря */}
          <div className="calendar-grid">
            {days.map((day) => {
              const isCompleted = isWorkoutCompleted(day);
              return (
                <button
                  key={day}
                  data-day={day}
                  onClick={() => handleDateClick(day)}
                  className={`calendar-day ${selectedDay === day && scheduledWorkouts.includes(day) ? 'selected' : ''} ${scheduledWorkouts.includes(day) ? 'has-workout' : ''} ${isCompleted ? 'completed' : ''}`}
                  disabled={!scheduledWorkouts.includes(day)}
                >
                  {day}
                  {isCompleted && <span className="completion-check">✓</span>}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Планы - показываем только при выборе даты с тренировкой */}
      {selectedDay && scheduledWorkouts.includes(selectedDay) && (
        <>
          <section className="plans-section">
            <h2>Планы на выбранный день</h2>
          </section>
          
          <div className="plans-list">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card clickable ${plan.type === 'workout' ? 'workout' : 'nutrition'}`}
                onClick={() => handlePlanClick(plan.type)}
              >
                <div className="plan-info">
                  <h3>{plan.title}</h3>
                  <p className="plan-time">{plan.time}</p>
                </div>
                <div className="plan-arrow">›</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { Schedule };
