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
  const [showCompletedWorkouts, setShowCompletedWorkouts] = useState<number | null>(null); // День, для которого показываем выполненные тренировки
  const [userName, setUserName] = useState<string>('Александр'); // Имя пользователя

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

  // Функция для проверки, выполнена ли тренировка или питание в определенный день
  const isWorkoutCompleted = (day: number): boolean => {
    const currentYear = new Date().getFullYear();
    
    // Проверяем тренировки
    const hasWorkouts = completedWorkouts.some(workout => {
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

    // Проверяем питание
    const nutritionData = localStorage.getItem('nutritionData');
    if (nutritionData) {
      const meals = JSON.parse(nutritionData);
      const hasMeals = meals.some((meal: any) => {
        const mealDate = new Date(meal.date);
        const mealDay = mealDate.getDate();
        const mealMonth = mealDate.getMonth();
        const mealYear = mealDate.getFullYear();
        
        return mealDay === day && 
               mealMonth === selectedMonth && 
               mealYear === currentYear;
      });
      
      if (hasMeals) return true;
    }
    
    return hasWorkouts;
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

  // Функция для получения выполненных тренировок за определенный день
  const getCompletedWorkoutsForDay = (day: number): CompletedWorkout[] => {
    const currentYear = new Date().getFullYear();
    
    return completedWorkouts.filter(workout => {
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

  // Функция для получения всех выполненных задач за определенный день (тренировки + питание)
  const getCompletedTasksForDay = (day: number): any[] => {
    const currentYear = new Date().getFullYear();
    const tasks: any[] = [];
    
    // Добавляем тренировки
    const workouts = completedWorkouts.filter(workout => {
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
    
    workouts.forEach(workout => {
      tasks.push({
        ...workout,
        type: 'workout',
        displayDate: new Date(workout.date)
      });
    });
    
    // Добавляем питание
    const nutritionData = localStorage.getItem('nutritionData');
    if (nutritionData) {
      const meals = JSON.parse(nutritionData);
      
      const dayMeals = meals.filter((meal: any) => {
        const mealDate = new Date(meal.date);
        const mealDay = mealDate.getDate();
        const mealMonth = mealDate.getMonth();
        const mealYear = mealDate.getFullYear();
        
        return mealDay === day && 
               mealMonth === selectedMonth && 
               mealYear === currentYear;
      });
      
             dayMeals.forEach((meal: any) => {
         tasks.push({
           ...meal,
           type: 'meal',
           displayDate: new Date(meal.date)
         });
       });
    }
    
    // Сортируем по времени выполнения
    return tasks.sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime());
  };

  const handleDateClick = (day: number) => {
    // Проверяем, есть ли тренировка в этот день в выбранном месяце
    const currentYear = new Date().getFullYear();
    const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Проверяем, что день входит в диапазон месяца
    if (day >= 1 && day <= daysInMonth) {
      if (scheduledWorkouts.includes(day)) {
        // Если есть запланированная тренировка
        setSelectedDay(selectedDay === day ? null : day);
        setShowCompletedWorkouts(null);
        // Сохраняем запланированный день при выборе
        if (selectedDay !== day) {
          setPlannedDay(day);
        } else {
          setPlannedDay(null);
        }
      } else if (isWorkoutCompleted(day)) {
        // Если нет запланированной тренировки, но есть выполненная
        setShowCompletedWorkouts(showCompletedWorkouts === day ? null : day);
        setSelectedDay(null);
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

  const handleProfileClick = () => {
    navigate('/miniapp/sport-nutrition/profile');
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
        {/* Блок с информацией о пользователе */}
        <div className="user-profile-section" onClick={handleProfileClick}>
          <div className="user-profile-content">
            <div className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="user-info">
              <span className="user-greeting">Привет,</span>
              <span className="user-name">{userName}</span>
            </div>
            <div className="profile-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Заголовок и навигация */}
        <header className="header-section">
          <div className="title-container">
            <h1>Моё</h1>
            <h1>расписание</h1>
          </div>
          


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
                  className={`calendar-day ${selectedDay === day && scheduledWorkouts.includes(day) ? 'selected' : ''} ${scheduledWorkouts.includes(day) ? 'has-workout' : ''} ${isCompleted ? 'completed' : ''} ${isMoved ? 'moved' : ''} ${showCompletedWorkouts === day ? 'selected' : ''}`}
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

      {/* Выполненные тренировки и питание - показываем при выборе даты без запланированной тренировки */}
      {showCompletedWorkouts && !scheduledWorkouts.includes(showCompletedWorkouts) && (
        <>
          <section className="plans-section">
            <h2>Выполненные задачи {showCompletedWorkouts} {months[selectedMonth].toLowerCase()}</h2>
          </section>
          
          <div className="plans-list">
            {getCompletedTasksForDay(showCompletedWorkouts).map((task, index) => (
              <div
                key={`task-${index}`}
                className={`plan-card ${task.type === 'workout' ? 'completed-workout' : 'completed-meal'}`}
              >
                <div className="plan-info">
                  {task.type === 'workout' ? (
                    <>
                      <h3>Тренировка #{index + 1}</h3>
                      <p className="plan-time">
                        {task.displayDate.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="workout-stats">
                        Выполнено: {task.completedCount}/{task.totalCount} ({task.percentage}%)
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>Прием пищи: {task.mealType}</h3>
                      <p className="plan-time">
                        {task.displayDate.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="meal-stats">
                        Время: {task.mealTime} • Уровень насыщения: {task.satietyLevel}
                      </p>
                    </>
                  )}
                </div>
                <div className="completion-badge">
                  {task.type === 'workout' ? '💪' : '🍽️'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Блок "История" - всегда отображается внизу */}
      <section className="history-section">
        <h2>История</h2>
        <div className="history-links">
          <button 
            className="history-link-btn workout-link"
            onClick={() => navigate('workout-history')}
          >
            <span className="history-link-icon">💪</span>
            <span className="history-link-text">Проведенные тренировки</span>
            <span className="history-link-count">{completedWorkouts.length}</span>
          </button>
          
          <button 
            className="history-link-btn nutrition-link"
            onClick={() => navigate('nutrition-history')}
          >
            <span className="history-link-icon">🍽️</span>
            <span className="history-link-text">Заполненные приемы питания</span>
            <span className="history-link-count">
              {(() => {
                const nutritionData = localStorage.getItem('nutritionData');
                if (nutritionData) {
                  const meals = JSON.parse(nutritionData);
                  return meals.length;
                }
                return 0;
              })()}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export { Schedule };
