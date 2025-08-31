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

  const handleDownloadPDF = () => {
    if (completedWorkouts.length === 0) {
      alert('История тренировок пуста');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>История тренировок</title>
          <style>
            @page {
              margin: 2cm;
              size: A4;
            }
            
            @media print {
              body {
                padding: 0 20px;
              }
            }
            
            body { 
              font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 40px 40px 0 40px;
              line-height: 1.6;
              color: #1F2937;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #1E40AF;
            }
            
            h1 { 
              color: #1E40AF; 
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 10px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .subtitle {
              color: #6B7280;
              font-size: 16px;
              font-weight: 400;
              margin: 0;
            }
            
            h2 { 
              color: #1E40AF; 
              font-size: 20px;
              font-weight: 600;
              margin: 30px 0 20px 0;
              padding: 10px 0;
              border-bottom: 2px solid #E5E7EB;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .section { 
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            
            .workout-item {
              margin: 15px 0; 
              padding: 20px; 
              border: 2px solid #E5E7EB; 
              border-radius: 12px;
              background: #F9FAFB;
              page-break-inside: avoid;
            }
            
            .workout-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .workout-date {
              font-size: 18px;
              font-weight: 600;
              color: #1E40AF;
            }
            
            .workout-number {
              background: #1E40AF;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
            }
            
            .workout-stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            
            .stat-item {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #E5E7EB;
            }
            
            .stat-label {
              font-size: 12px;
              color: #6B7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #1E40AF;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
              text-align: center;
              color: #6B7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>История тренировок</h1>
            <p class="subtitle">Отчет о выполненных тренировках</p>
          </div>
          
          <div class="section">
            <h2>Выполненные тренировки</h2>
            ${completedWorkouts.map((workout, index) => {
              const date = new Date(workout.date);
              const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return `
                <div class="workout-item">
                  <div class="workout-header">
                    <div class="workout-date">${formattedDate}</div>
                    <div class="workout-number">Тренировка #${index + 1}</div>
                  </div>
                  <div class="workout-stats">
                    <div class="stat-item">
                      <div class="stat-label">Выполнено</div>
                      <div class="stat-value">${workout.completedCount}</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-label">Всего</div>
                      <div class="stat-value">${workout.totalCount}</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-label">Процент</div>
                      <div class="stat-value">${workout.percentage}%</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="footer">
            <p>Отчет сгенерирован ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `История_тренировок_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="workout-history-container">
      <header className="history-header">
        <h1>История тренировок</h1>
        {completedWorkouts.length > 0 && (
          <button 
            className="download-pdf-btn"
            onClick={handleDownloadPDF}
          >
            <span className="download-icon">📥</span>
            <span className="download-text">Скачать PDF</span>
          </button>
        )}
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