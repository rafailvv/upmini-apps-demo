import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  setsData?: SetData[];
  notes?: string;
}

interface SetData {
  id: string;
  weight: string;
  reps: string;
  difficulty: string;
  energy: string;
  completed: boolean;
  notes?: string;
}

interface CommentData {
  text: string;
  video?: string;
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
  const location = useLocation();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);
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

  const [comments, setComments] = useState<{ [key: number]: CommentData }>({});
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  // Обработка данных из истории
  useEffect(() => {
    if (location.state?.fromHistory && location.state?.selectedWorkout) {
      setIsFromHistory(true);
      setWorkoutCompleted(true);
      
      // Если есть данные о тренировке из истории, можно их использовать
      // для отображения детальной информации
      console.log('Loading workout from history:', location.state.selectedWorkout);
    }
  }, [location.state]);

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
      [exerciseId]: { 
        text: comment,
        video: prev[exerciseId]?.video
      }
    }));
  };

  const handleExerciseDataChange = (exerciseId: number, field: string, value: string) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, [field]: value }
        : exercise
    ));
  };

  const handleSetDataChange = (exerciseId: number, setId: string, field: string, value: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSetsData = exercise.setsData?.map(set => 
          set.id === setId ? { ...set, [field]: value } : set
        ) || [];
        return { ...exercise, setsData: updatedSetsData };
      }
      return exercise;
    }));
  };

  const addSet = (exerciseId: number) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const newSet: SetData = {
          id: Date.now().toString(),
          weight: '',
          reps: '',
          difficulty: '',
          energy: '',
          completed: false,
          notes: ''
        };
        const updatedSetsData = [...(exercise.setsData || []), newSet];
        return { ...exercise, setsData: updatedSetsData };
      }
      return exercise;
    }));
  };

  const removeSet = (exerciseId: number, setId: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSetsData = exercise.setsData?.filter(set => set.id !== setId) || [];
        return { ...exercise, setsData: updatedSetsData };
      }
      return exercise;
    }));
  };

  const toggleSetCompletion = (exerciseId: number, setId: string) => {
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSetsData = exercise.setsData?.map(set => 
          set.id === setId ? { ...set, completed: !set.completed } : set
        ) || [];
        return { ...exercise, setsData: updatedSetsData };
      }
      return exercise;
    }));
  };

  const toggleExerciseExpansion = (exerciseId: number) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const handleVideoUpload = (exerciseId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoUrl = e.target?.result as string;
        setComments(prev => ({
          ...prev,
          [exerciseId]: {
            text: prev[exerciseId]?.text || '',
            video: videoUrl
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideo = (exerciseId: number) => {
    setComments(prev => ({
      ...prev,
      [exerciseId]: {
        text: prev[exerciseId]?.text || '',
        video: undefined
      }
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
      comments: comments,
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
        <h1>{isFromHistory ? 'Просмотр тренировки' : 'Тренировки'}</h1>
        <div className={`progress-indicator ${workoutCompleted ? 'completed' : ''}`}>
          Выполнено: <span className="completed-count">{completedCount}</span>/{exercises.length}
        </div>
      </div>

      {/* Список упражнений */}
      <div className="exercises-list">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-section">
            {/* Карточка упражнения */}
            <div className="exercise-card">
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
                  <div>Вес: {exercise.weight}</div>
                  <div>{exercise.muscleGroup}</div>
                </div>
              </div>

              {/* Индикатор выполнения */}
              <div 
                className={`completion-indicator ${exercise.completed ? 'completed' : ''}`}
                onClick={() => toggleExerciseCompletion(exercise.id)}
              ></div>

              {/* Кнопка раскрытия формы */}
              <button 
                className="expand-exercise-btn"
                onClick={() => toggleExerciseExpansion(exercise.id)}
              >
                {expandedExercise === exercise.id ? '−' : '+'}
              </button>
            </div>

            {/* Форма для ввода данных о тренировке */}
            {expandedExercise === exercise.id && (
              <div className="exercise-data-form">
                <div className="form-header">
                  <h4>Данные о тренировке</h4>
                  <button 
                    className="add-set-btn"
                    onClick={() => addSet(exercise.id)}
                  >
                    + Добавить подход
                  </button>
                </div>
                
                {/* Список подходов */}
                <div className="sets-list">
                  {exercise.setsData?.map((set, index) => (
                    <div key={set.id} className="set-item">
                      <div className="set-header">
                        <span className="set-number">Подход {index + 1}</span>
                        <div className="set-actions">
                          <button 
                            className={`set-completion-btn ${set.completed ? 'completed' : ''}`}
                            onClick={() => toggleSetCompletion(exercise.id, set.id)}
                          >
                            {set.completed ? '✓' : '○'}
                          </button>
                          <button 
                            className="remove-set-btn"
                            onClick={() => removeSet(exercise.id, set.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="set-fields">
                        <div className="set-field">
                          <label>Вес (кг) / Расстояние (км):</label>
                          <input
                            type="text"
                            placeholder="Вес или расстояние"
                            value={set.weight}
                            onChange={(e) => handleSetDataChange(exercise.id, set.id, 'weight', e.target.value)}
                          />
                        </div>
                        <div className="set-field">
                          <label>Повторения:</label>
                          <input
                            type="text"
                            placeholder="Количество"
                            value={set.reps}
                            onChange={(e) => handleSetDataChange(exercise.id, set.id, 'reps', e.target.value)}
                          />
                        </div>
                        <div className="set-field">
                          <label>Сложность:</label>
                          <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                className={`rating-btn ${set.difficulty === value.toString() ? 'active' : ''}`}
                                onClick={() => handleSetDataChange(exercise.id, set.id, 'difficulty', value.toString())}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="set-field">
                          <label>Энергия:</label>
                          <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                className={`rating-btn ${set.energy === value.toString() ? 'active' : ''}`}
                                onClick={() => handleSetDataChange(exercise.id, set.id, 'energy', value.toString())}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="set-field">
                          <label>Дополнительные заметки:</label>
                          <input
                            type="text"
                            placeholder="Заметки к подходу"
                            value={set.notes || ''}
                            onChange={(e) => handleSetDataChange(exercise.id, set.id, 'notes', e.target.value)}
                          />
                        </div>

                      </div>
                    </div>
                  ))}
                  
                  {(!exercise.setsData || exercise.setsData.length === 0) && (
                    <div className="no-sets-message">
                      Нажмите "Добавить подход" чтобы начать записывать данные
                    </div>
                  )}
                </div>


              </div>
            )}

            {/* Загрузка видео */}
            <div className="video-upload-section">
              <input
                type="file"
                accept="video/*"
                id={`video-upload-${exercise.id}`}
                onChange={(e) => handleVideoUpload(exercise.id, e)}
                style={{ display: 'none' }}
              />
              
              {!comments[exercise.id]?.video ? (
                <label htmlFor={`video-upload-${exercise.id}`} className="video-upload-area">
                  <div className="video-upload-content">
                    <div className="video-upload-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V16C18 17.1 17.1 18 16 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2ZM12 4C11.4 4 11 4.4 11 5V7H13V5C13 4.4 12.6 4 12 4ZM8 8C7.4 8 7 8.4 7 9V15C7 15.6 7.4 16 8 16H16C16.6 16 17 15.6 17 15V9C17 8.4 16.6 8 16 8H8Z" fill="currentColor"/>
                        <path d="M10 10H14V12H10V10ZM10 13H14V15H10V13Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div className="video-upload-text">
                      <span className="video-upload-title">Добавить видео</span>
                      <span className="video-upload-subtitle">Записать выполнение упражнения</span>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="video-preview-container">
                  <div className="video-preview-header">
                    <span className="video-preview-title">Видео упражнения</span>
                    <button 
                      className="remove-video-btn"
                      onClick={() => removeVideo(exercise.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 1C8.55228 1 9 1.44772 9 2V3H10C10.5523 3 11 3.44772 11 4C11 4.55228 10.5523 5 10 5H9V6H10C10.5523 6 11 6.44772 11 7C11 7.55228 10.5523 8 10 8H9V9H10C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11H9V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V11H6C5.44772 11 5 10.5523 5 10C5 9.44772 5.44772 9 6 9H7V8H6C5.44772 8 5 7.55228 5 7C5 6.44772 5.44772 6 6 6H7V5H6C5.44772 5 5 4.55228 5 4C5 3.44772 5.44772 3 6 3H7V2C7 1.44772 7.44772 1 8 1Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                  <div className="video-preview">
                    <video 
                      src={comments[exercise.id].video} 
                      controls 
                      className="uploaded-video"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Поле комментария */}
            <div className="comment-field">
              <input
                type="text"
                placeholder="Комментарий к упражнению"
                value={comments[exercise.id]?.text || ''}
                onChange={(e) => handleCommentChange(exercise.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка завершения тренировки - скрыта при просмотре из истории */}
      {!isFromHistory && (
        <button className="complete-workout-btn" onClick={handleCompleteWorkout}>
          <span>Завершить тренировку</span>
        </button>
      )}

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
