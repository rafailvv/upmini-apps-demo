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
  originalPlannedDay?: number;
  originalPlannedMonth?: number;
  originalPlannedYear?: number;
}

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [lastCompletedWorkout, setLastCompletedWorkout] = useState<any>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [plannedDay, setPlannedDay] = useState<number | null>(null); // День, на который планировалась тренировка

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

  // Автоматическая прокрутка к текущему месяцу при загрузке
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    
    // Небольшая задержка для гарантии, что DOM полностью загружен
    const timer = setTimeout(() => {
      const activeMonthBtn = document.querySelector(`[data-month="${currentMonth}"]`);
      
      if (activeMonthBtn) {
        // Прокручиваем к активному месяцу
        activeMonthBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Функция для проверки, выполнена ли тренировка в определенный день
  const isWorkoutCompleted = (day: number): boolean => {
    const currentYear = new Date().getFullYear();
    
    return completedWorkouts.some(workout => {
      const workoutDate = new Date(workout.date);
      const workoutDay = workoutDate.getDate();
      const workoutMonth = workoutDate.getMonth();
      const workoutYear = workoutDate.getFullYear();
      
      // Проверяем прямой день
      if (workoutDay === day && 
          workoutMonth === selectedMonth && 
          workoutYear === currentYear) {
        return true;
      }
      
      // Проверяем объединенные дни (если тренировка была перенесена)
      if (workout.originalPlannedDay && 
          workout.originalPlannedDay === day &&
          workout.originalPlannedMonth === selectedMonth &&
          workout.originalPlannedYear === currentYear) {
        return true;
      }
      
      return false;
    });
  };

  // Функция для проверки, является ли день объединенным (перенесенным)
  const isWorkoutMoved = (day: number): boolean => {
    const currentYear = new Date().getFullYear();
    
    return completedWorkouts.some(workout => {
      const workoutDate = new Date(workout.date);
      const workoutDay = workoutDate.getDate();
      const workoutMonth = workoutDate.getMonth();
      const workoutYear = workoutDate.getFullYear();
      
      // Проверяем, что тренировка была выполнена в этот день, но изначально планировалась на другой день
      if (workoutDay === day && 
          workoutMonth === selectedMonth && 
          workoutYear === currentYear &&
          workout.originalPlannedDay &&
          (workout.originalPlannedDay !== day || 
           workout.originalPlannedMonth !== selectedMonth ||
           workout.originalPlannedYear !== currentYear)) {
        return true;
      }
      
      return false;
    });
  };

  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Дни с запланированными тренировками
  const scheduledWorkouts = [3, 7, 10, 14, 17, 21, 24, 28];

  const handleDateClick = (day: number) => {
    // Проверяем, есть ли тренировка в этот день в выбранном месяце
    const currentYear = new Date().getFullYear();
    const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Проверяем, что день входит в диапазон месяца и есть запланированная тренировка
    if (day >= 1 && day <= daysInMonth && scheduledWorkouts.includes(day)) {
      setSelectedDay(selectedDay === day ? null : day);
      // Сохраняем запланированный день при выборе
      if (selectedDay !== day) {
        setPlannedDay(day);
      } else {
        setPlannedDay(null);
      }
    }
  };

  const handlePlanClick = (planType: string) => {
    if (planType === 'workout') {
      // Передаем информацию о запланированном дне через localStorage
      if (plannedDay) {
        localStorage.setItem('plannedWorkoutDay', JSON.stringify({
          day: plannedDay,
          month: selectedMonth,
          year: new Date().getFullYear()
        }));
      }
      navigate('workouts');
    } else if (planType === 'nutrition') {
      navigate('nutrition');
    }
  };

  const plans: DayPlan[] = [
    { id: 1, title: 'Тренировки', type: 'workout', time: '09:00' },
    { id: 2, title: 'Питание', type: 'nutrition', time: '10:00' }
  ];

  // Генерация календаря для выбранного месяца
  const generateCalendar = () => {
    const currentYear = new Date().getFullYear();
    const firstDayOfMonth = new Date(currentYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Получаем день недели первого дня месяца (0 = воскресенье, 1 = понедельник, и т.д.)
    let firstDayWeekday = firstDayOfMonth.getDay();
    // Преобразуем в наш формат (0 = понедельник, 6 = воскресенье)
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    
    const calendar = [];
    
    // Добавляем пустые ячейки для дней до начала месяца
    for (let i = 0; i < firstDayWeekday; i++) {
      calendar.push(null);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };

  const calendarDays = generateCalendar();

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
                  data-month={index}
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
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
              }
              
              const isCompleted = isWorkoutCompleted(day);
              const isMoved = isWorkoutMoved(day);
              return (
                <button
                  key={day}
                  data-day={day}
                  onClick={() => handleDateClick(day)}
                  className={`calendar-day ${selectedDay === day && scheduledWorkouts.includes(day) ? 'selected' : ''} ${scheduledWorkouts.includes(day) ? 'has-workout' : ''} ${isCompleted ? 'completed' : ''} ${isMoved ? 'moved' : ''}`}
                  disabled={!scheduledWorkouts.includes(day)}
                >
                  {day}
                  {isCompleted && <span className="completion-check">✓</span>}
                  {isMoved && <span className="moved-indicator">↔</span>}
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
            <h2>Планы на {selectedDay} {months[selectedMonth].toLowerCase()}</h2>
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
