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

  const handleDownloadPDF = () => {
    if (completedMeals.length === 0) {
      alert('История питания пуста');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>История питания</title>
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
            
            .meal-item {
              margin: 15px 0; 
              padding: 20px; 
              border: 2px solid #E5E7EB; 
              border-radius: 12px;
              background: #F9FAFB;
              page-break-inside: avoid;
            }
            
            .meal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .meal-date {
              font-size: 18px;
              font-weight: 600;
              color: #1E40AF;
            }
            
            .meal-number {
              background: #1E40AF;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
            }
            
            .meal-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            
            .detail-item {
              padding: 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #E5E7EB;
            }
            
            .detail-label {
              font-size: 12px;
              color: #6B7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .detail-value {
              font-size: 16px;
              font-weight: 600;
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
            <h1>История питания</h1>
            <p class="subtitle">Отчет о приемах пищи</p>
          </div>
          
          <div class="section">
            <h2>Приемы пищи</h2>
            ${completedMeals.map((meal, index) => {
              const date = new Date(meal.date);
              const formattedDate = date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return `
                <div class="meal-item">
                  <div class="meal-header">
                    <div class="meal-date">${formattedDate}</div>
                    <div class="meal-number">Прием пищи #${index + 1}</div>
                  </div>
                  <div class="meal-details">
                    <div class="detail-item">
                      <div class="detail-label">Тип приема пищи</div>
                      <div class="detail-value">${getMealTypeText(meal.mealType)}</div>
                    </div>
                    <div class="detail-item">
                      <div class="detail-label">Время</div>
                      <div class="detail-value">${meal.mealTime}</div>
                    </div>
                    <div class="detail-item">
                      <div class="detail-label">Уровень насыщения</div>
                      <div class="detail-value">${getSatietyText(meal.satietyLevel)}</div>
                    </div>
                    <div class="detail-item">
                      <div class="detail-label">Описание</div>
                      <div class="detail-value">${meal.mealDescription || 'Не указано'}</div>
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
    link.download = `История_питания_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="nutrition-history-container">
      <header className="history-header">
        <h1>История питания</h1>
        {completedMeals.length > 0 && (
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