import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface CompletedMeal {
  date: string;
  mealType: string;
  mealTime: string;
  satietyLevel: string;
  mealDescription: string;
  stateRating: number;
  selectedImage?: string;
  macronutrients?: {
    proteins: number;
    fats: number;
    carbohydrates: number;
  };
}

const NutritionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [completedMeals, setCompletedMeals] = useState<CompletedMeal[]>([]);
  const [mealNumbers, setMealNumbers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const nutritionData = localStorage.getItem('nutritionData');
    if (nutritionData) {
      try {
        const meals = JSON.parse(nutritionData);
        const validMeals = Array.isArray(meals) ? meals : [];
        setCompletedMeals(validMeals);
        
        // Группируем приемы пищи по дате и создаем нумерацию
        // Если несколько приемов пищи в один день - добавляем подпункты (1_1, 1_2, etc.)
        const mealGroups: { [key: string]: number } = {};
        const numbers: { [key: number]: string } = {};
        let currentGroupNumber = 1;
        
        validMeals.forEach((meal, index) => {
          const dateKey = new Date(meal.date).toDateString();
          
          if (mealGroups[dateKey]) {
            mealGroups[dateKey]++;
            numbers[index] = `${currentGroupNumber}_${mealGroups[dateKey]}`;
          } else {
            mealGroups[dateKey] = 1;
            numbers[index] = `${currentGroupNumber}`;
            currentGroupNumber++;
          }
        });
        
        setMealNumbers(numbers);
      } catch (error) {
        console.error('Error parsing nutrition data:', error);
        setCompletedMeals([]);
        setMealNumbers({});
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

  const getMealTypeText = (mealType: string) => {
    const mealTypes: { [key: string]: string } = {
      'breakfast': 'Завтрак',
      'lunch': 'Обед',
      'dinner': 'Ужин',
      'snacks': 'Перекусы'
    };
    return mealTypes[mealType] || mealType;
  };

  const getSatietyText = (satietyLevel: string) => {
    const satietyLevels: { [key: string]: string } = {
      'underfed': 'Недоедание',
      'satisfied': 'Сытость',
      'overfed': 'Переедание'
    };
    return satietyLevels[satietyLevel] || satietyLevel;
  };

  return (
    <div className="nutrition-history-container">
      <header className="history-header">
        <h1>История питания</h1>
      </header>

      <main className="history-main">
        {completedMeals.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">🍽️</div>
            <h2>История питания пуста</h2>
            <p>Заполненные приемы пищи появятся здесь</p>
            <button 
              className="start-nutrition-btn"
              onClick={() => navigate('nutrition')}
            >
              Заполнить прием пищи
            </button>
          </div>
        ) : (
          <div className="nutrition-history-list">
            {completedMeals.map((meal, index) => (
              <div 
                key={index} 
                className="nutrition-history-item"
                onClick={() => {
                  // Навигация к детальному просмотру приема пищи
                  navigate('nutrition', { 
                    state: { 
                      selectedMeal: meal,
                      fromHistory: true 
                    } 
                  });
                }}
              >
                <div className="nutrition-history-info">
                  <div className="nutrition-history-header">
                    <h3>{getMealTypeText(meal.mealType)} #{mealNumbers[index] || (completedMeals.length - index)}</h3>
                    <span className="meal-date">{formatDate(meal.date)}</span>
                  </div>
                  
                  <div className="meal-details">
                    <div className="detail-item">
                      <span className="detail-label">Время:</span>
                      <span className="detail-value">{meal.mealTime || 'Не указано'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Насыщение:</span>
                      <span className="detail-value">{getSatietyText(meal.satietyLevel || '')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Состояние:</span>
                      <span className="detail-value">{meal.stateRating || 0}/10</span>
                    </div>
                  </div>

                  {meal.mealDescription && meal.mealDescription.trim() && (
                    <div className="meal-description">
                      <span className="description-label">Описание:</span>
                      <p className="description-text">{meal.mealDescription}</p>
                    </div>
                  )}

                  {meal.selectedImage && meal.selectedImage.trim() && (
                    <div className="meal-photo">
                      <span className="photo-label">Фото:</span>
                      <div className="photo-preview">
                        <img 
                          src={meal.selectedImage} 
                          alt="Фото приема пищи" 
                          className="meal-image"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="nutrition-badge">
                  <span className="badge-icon">🍽️</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export { NutritionHistory };