import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import './Schedule.css';



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
  // const [lastCompletedWorkout, setLastCompletedWorkout] = useState<any>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [plannedDay, setPlannedDay] = useState<number | null>(null); // День, на который планировалась тренировка
  const [showCompletedWorkouts, setShowCompletedWorkouts] = useState<number | null>(null); // День, для которого показываем выполненные тренировки
  const [userName, setUserName] = useState<string>(''); // Имя пользователя
  const [activeFilter, setActiveFilter] = useState<'all' | 'workouts' | 'nutrition'>('all');

  // Загружаем информацию о последней завершенной тренировке и всех выполненных тренировках при монтировании компонента
  useEffect(() => {
    // const savedWorkout = localStorage.getItem('lastCompletedWorkout');
    // if (savedWorkout) {
    //   setLastCompletedWorkout(JSON.parse(savedWorkout));
    // }

    // Загружаем все выполненные тренировки
    const savedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    if (savedCompletedWorkouts) {
      setCompletedWorkouts(JSON.parse(savedCompletedWorkouts));
    }

    // Загружаем имя пользователя из localStorage
    const userData = localStorage.getItem('userData');
    console.log('=== USER DATA DEBUG ===');
    console.log('Raw userData from localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log('Parsed user data:', parsedUserData);
        
        if (parsedUserData.firstName || parsedUserData.lastName) {
          const fullName = `${parsedUserData.firstName || ''} ${parsedUserData.lastName || ''}`.trim();
          console.log('Full name constructed:', fullName);
          setUserName(fullName || 'Пользователь');
        } else {
          console.log('No first name or last name found, using default');
          setUserName('Пользователь');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        setUserName('Пользователь');
      }
    } else {
      console.log('No userData found in localStorage');
      setUserName('Пользователь');
    }
    console.log('Final userName state:', userName);
    console.log('========================');
  }, []);

  // Автоматическая прокрутка к текущему месяцу при загрузке
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    
    // Устанавливаем текущий месяц как выбранный
    setSelectedMonth(currentMonth);
    
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

  // Функция для проверки типа выполнения тренировки в определенный день
  const getWorkoutCompletionType = (day: number): 'completed' | 'moved' | 'none' => {
    const currentYear = new Date().getFullYear();
    
    // Проверяем тренировки
    const workout = completedWorkouts.find(workout => {
      const workoutDate = new Date(workout.date);
      const workoutDay = workoutDate.getDate();
      const workoutMonth = workoutDate.getMonth();
      const workoutYear = workoutDate.getFullYear();
      
      return workoutDay === day && 
             workoutMonth === selectedMonth && 
             workoutYear === currentYear;
    });

    if (workout) {
      // Проверяем, была ли тренировка запланирована на этот день
      if (workout.originalPlannedDay && 
          workout.originalPlannedMonth !== undefined && 
          workout.originalPlannedYear !== undefined) {
        
        // Если тренировка была запланирована на этот же день - completed
        if (workout.originalPlannedDay === day && 
            workout.originalPlannedMonth === selectedMonth && 
            workout.originalPlannedYear === currentYear) {
          return 'completed';
        }
        // Если тренировка была запланирована на другой день - moved
        return 'moved';
      }
      
      // Если нет информации о запланированной дате, считаем как moved
      return 'moved';
    }
    
    return 'none';
  };

  // Функция для проверки, выполнена ли тренировка или питание в определенный день (для обратной совместимости)
  const isWorkoutCompleted = (day: number): boolean => {
    return getWorkoutCompletionType(day) !== 'none';
  };



  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Дни с запланированными тренировками (конкретные даты)
  const scheduledWorkouts = [
    "2025-08-03", "2025-08-07", "2025-08-10", "2025-08-14", "2025-08-17", "2025-08-21", "2025-08-24", "2025-08-28","2025-08-31",
    "2025-09-02", "2025-09-05", "2025-09-09", "2025-09-12", "2025-09-16", "2025-09-19", "2025-09-23", "2025-09-26", "2025-09-30",
    "2025-10-03", "2025-10-07", "2025-10-10", "2025-10-14", "2025-10-17", "2025-10-21", "2025-10-24", "2025-10-28", "2025-10-31"
  ];

  // Вспомогательная функция для проверки, является ли день запланированным
  const isScheduledWorkoutDay = (day: number): boolean => {
    const currentYear = new Date().getFullYear();
    const checkDate = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledWorkouts.includes(checkDate);
  };

  // Функция для проверки, была ли выполнена тренировка на запланированном дне
  const hasScheduledWorkoutCompleted = (day: number): boolean => {
    const currentYear = new Date().getFullYear();
    console.log(completedWorkouts);
    // Проверяем все выполненные тренировки
    return completedWorkouts.some(workout => {
      // Проверяем, есть ли информация о запланированной дате
      if (workout.originalPlannedDay && 
          workout.originalPlannedMonth !== undefined && 
          workout.originalPlannedYear !== undefined) {
        
        // Если тренировка была запланирована на этот день (неважно, в какой день выполнена)
        if (workout.originalPlannedDay === day && 
            workout.originalPlannedMonth === selectedMonth && 
            workout.originalPlannedYear === currentYear) {
          return true;
        }
      }
      return false;
    });
  };

  // Функция для получения выполненных тренировок за определенный день
  // const getCompletedWorkoutsForDay = (day: number): CompletedWorkout[] => {
  //   const currentYear = new Date().getFullYear();
  //   
  //   return completedWorkouts.filter(workout => {
  //     const workoutDate = new Date(workout.date);
  //     const workoutDay = workoutDate.getDate();
  //     const workoutMonth = workoutDate.getMonth();
  //     const workoutYear = workoutDate.getFullYear();
  //     
  //     // Проверяем прямой день
  //     if (workoutDay === day && 
  //         workoutMonth === selectedMonth && 
  //         workoutYear === currentYear) {
  //       return true;
  //     }
  //     
  //     // Проверяем объединенные дни (если тренировка была перенесена)
  //     if (workout.originalPlannedDay && 
  //         workout.originalPlannedDay === day &&
  //         workout.originalPlannedMonth === selectedMonth &&
  //         workout.originalPlannedYear === currentYear) {
  //       return true;
  //     }
  //     
  //     return false;
  //   });
  // };

  // Функция для получения перенесенных тренировок за определенный день
  const getMovedWorkoutsForDay = (day: number): CompletedWorkout[] => {
    const currentYear = new Date().getFullYear();
    
    // Для тестирования добавляем перенесенные тренировки на 13 и 14 сентября
    if (selectedMonth === 8 && (day === 13 || day === 14)) { // Сентябрь = 8 (0-based)
      return [
        {
          date: `${currentYear}-09-${String(day).padStart(2, '0')}T10:00:00.000Z`,
          completedCount: 1,
          totalCount: 1,
          percentage: 100,
          originalPlannedDay: 10,
          originalPlannedMonth: 8,
          originalPlannedYear: currentYear
        }
      ];
    }
    
    return completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      const workoutDay = workoutDate.getDate();
      const workoutMonth = workoutDate.getMonth();
      const workoutYear = workoutDate.getFullYear();
      
      // Проверяем, что тренировка выполнена в этот день
      if (workoutDay === day && 
          workoutMonth === selectedMonth && 
          workoutYear === currentYear) {
        
        // Проверяем, что тренировка была перенесена (запланирована на другой день)
        if (workout.originalPlannedDay && 
            workout.originalPlannedMonth !== undefined && 
            workout.originalPlannedYear !== undefined) {
          
          const originalDate = `${workout.originalPlannedYear}-${String(workout.originalPlannedMonth + 1).padStart(2, '0')}-${String(workout.originalPlannedDay).padStart(2, '0')}`;
          const currentDate = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          // Если запланированная дата отличается от текущей - это перенесенная тренировка
          return originalDate !== currentDate;
        }
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
    // Проверяем, что день входит в диапазон месяца
    const currentYear = new Date().getFullYear();
    const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    if (day >= 1 && day <= daysInMonth) {
      // Открываем планы для любой даты
      if (selectedDay === day) {
        // Если кликаем на уже выбранный день - закрываем
        setSelectedDay(null);
        setShowCompletedWorkouts(null);
        setPlannedDay(null);
      } else {
        // Если кликаем на новый день - открываем планы
        setSelectedDay(day);
        setShowCompletedWorkouts(null);
        setPlannedDay(day);
      }
    }
  };



  const handleProfileClick = () => {
    navigate('/miniapp/sport-nutrition/profile');
  };

  // Функция для обработки изменения фильтра
  const handleFilterChange = (filter: 'all' | 'workouts' | 'nutrition') => {
    setActiveFilter(filter);
    setSelectedDay(null);
    setShowCompletedWorkouts(null);
  };





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

        {/* Кнопка "Метрики контроля" */}
        <div className="metrics-control-section" onClick={() => navigate('metrics-control')}>
          <div className="metrics-control-content">
            <div className="metrics-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19C9 20.1 8.1 21 7 21S5 20.1 5 19 5.9 17 7 17 9 17.9 9 19ZM19 7C19 8.1 18.1 9 17 9S15 8.1 15 7 15.9 5 17 5 19 5.9 19 7ZM7 13C5.9 13 5 12.1 5 11S5.9 9 7 9 9 9.9 9 11 8.1 13 7 13ZM17 15C15.9 15 15 14.1 15 13S15.9 11 17 11 19 11.9 19 13 18.1 15 17 15ZM7 5C5.9 5 5 5.9 5 7S5.9 9 7 9 9 8.1 9 7 8.1 5 7 5ZM17 19C15.9 19 15 18.1 15 17S15.9 15 17 15 19 15.9 19 17 18.1 19 17 19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="metrics-info">
              <span className="metrics-title">Метрики контроля</span>
              <span className="metrics-subtitle">Отслеживание прогресса</span>
            </div>
            <div className="metrics-arrow">
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

        {/* Кнопки фильтрации */}
        <div className="filter-buttons-section">
          <div className="filter-buttons">
            <button 
              className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              Все
            </button>
            <button 
              className={`filter-button ${activeFilter === 'workouts' ? 'active' : ''}`}
              onClick={() => handleFilterChange('workouts')}
            >
              Тренировки
            </button>
            <button 
              className={`filter-button ${activeFilter === 'nutrition' ? 'active' : ''}`}
              onClick={() => handleFilterChange('nutrition')}
            >
              Питание
            </button>
          </div>
        </div>

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
              
              const completionType = getWorkoutCompletionType(day);
              const isToday = day === new Date().getDate() && selectedMonth === new Date().getMonth();
              return (
                <button
                  key={day}
                  data-day={day}
                  onClick={() => handleDateClick(day)}
                  className={`calendar-day ${selectedDay === day && isScheduledWorkoutDay(day) ? 'selected' : ''} ${isScheduledWorkoutDay(day) ? 'has-workout' : ''} ${completionType === 'completed' ? 'completed' : ''} ${completionType === 'moved' ? 'moved' : ''} ${completionType === 'moved' && isScheduledWorkoutDay(day) ? 'scheduled-and-moved' : ''} ${showCompletedWorkouts === day ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                >
                  {day}
                  {/* Показываем галочку на запланированных днях, если была выполнена тренировка, запланированная на этот день */}
                  {isScheduledWorkoutDay(day) && hasScheduledWorkoutCompleted(day) && <span className="completion-check">✓</span>}
                  {/* Показываем индикатор перенесенных тренировок */}
                  {completionType === 'moved' && <span className="moved-indicator">↔</span>}
                </button>
              );
            })}
          </div>
        </section>
        
        {/* Легенда календаря */}
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot scheduled"></div>
            <span>Запланировано</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot completed">✓</div>
            <span>Выполнено</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot moved">↔</div>
            <span>Перенесено</span>
          </div>
        </div>
      </main>

      {/* Планы на выбранный день - показываем для запланированных дней */}
      {selectedDay && isScheduledWorkoutDay(selectedDay) && (
        <>
          <section className="plans-section">
            <h2>Планы на {selectedDay} {months[selectedMonth].toLowerCase()}</h2>
            <p className="plans-subtitle">Зависят от выбранной даты в календаре</p>
          </section>
          
          <div className="plans-list">
            <div className="plan-card clickable workout" onClick={() => navigate('workouts')}>
              <div className="plan-info">
                <h3>Тренировки</h3>
                <p className="plan-time">09:00</p>
              </div>
              <div className="plan-arrow">›</div>
            </div>
            
            <div className="plan-card clickable nutrition" onClick={() => navigate('nutrition')}>
              <div className="plan-info">
                <h3>Питание</h3>
                <p className="plan-time">10:00</p>
              </div>
              <div className="plan-arrow">›</div>
            </div>
          </div>
        </>
      )}


      {/* Перенесенные тренировки - показываем при выборе любой даты */}
      {selectedDay && getMovedWorkoutsForDay(selectedDay).length > 0 && (
        <>
          <section className="plans-section">
            <h2>{isScheduledWorkoutDay(selectedDay) ? 'Перенесенные тренировки' : 'Тренировки'} {selectedDay} {months[selectedMonth].toLowerCase()}</h2>
          </section>
          
          <div className="plans-list">
            {getMovedWorkoutsForDay(selectedDay).map((workout, index) => (
              <div
                key={`moved-workout-${index}`}
                className="plan-card moved-workout"
              >
                <div className="plan-info">
                  <h3>Перенесенная тренировка #{index + 1}</h3>
                  <p className="plan-time">
                    Выполнено: {new Date(workout.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="workout-stats">
                    Запланировано на: {workout.originalPlannedDay} {months[workout.originalPlannedMonth || 0].toLowerCase()}
                  </p>
                  <p className="workout-stats">
                    Выполнено: {workout.completedCount}/{workout.totalCount} ({workout.percentage}%)
                  </p>
                </div>
                <div className="completion-badge moved">
                  ↔
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Выполненные тренировки и питание - показываем при выборе даты без запланированной тренировки */}
      {showCompletedWorkouts && !isScheduledWorkoutDay(showCompletedWorkouts) && (
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
        <p className="history-subtitle">Общая история тренировок и питания</p>
        <div className="history-links">
          <button 
            className="history-link-btn workout-link"
            onClick={() => navigate('/miniapp/sport-nutrition/workout-history')}
          >
            <span className="history-link-icon">💪</span>
            <span className="history-link-text">История тренировок</span>
            <span className="history-link-count">{completedWorkouts.length}</span>
          </button>
          
          <button 
            className="history-link-btn nutrition-link"
            onClick={() => navigate('/miniapp/sport-nutrition/nutrition-history')}
          >
            <span className="history-link-icon">🍽️</span>
            <span className="history-link-text">История питания</span>
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
