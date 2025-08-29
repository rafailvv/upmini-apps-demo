import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface Macronutrients {
  proteins: number;
  fats: number;
  carbs: number;
}

interface FoodCategory {
  allowed: string[];
  excluded: string[];
}

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState<'завтрак' | 'обед' | 'ужин' | 'перекусы'>('завтрак');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [macronutrients, setMacronutrients] = useState<Macronutrients>({
    proteins: 25,
    fats: 12,
    carbs: 45
  });
  const [mealTime, setMealTime] = useState('08:00');

  // Генерация времени каждые 30 минут в зависимости от типа приема пищи
  const generateTimeOptions = (mealType: string) => {
    const times = [];
    let startHour = 0;
    let endHour = 24;

    // Ограничиваем время в зависимости от типа приема пищи
    switch (mealType) {
      case 'завтрак':
        startHour = 5;
        endHour = 12;
        break;
      case 'обед':
        startHour = 12;
        endHour = 17;
        break;
      case 'ужин':
        startHour = 17;
        endHour = 23;
        break;
      case 'перекусы':
        startHour = 0;
        endHour = 24;
        break;
      default:
        startHour = 0;
        endHour = 24;
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions(selectedMeal);
  const [mealDescription, setMealDescription] = useState('');
  const [satietyLevel, setSatietyLevel] = useState<'недоедание' | 'сытость' | 'переедание'>('недоедание');
  const [stateRating, setStateRating] = useState(3);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [completedMeals, setCompletedMeals] = useState<{[key: string]: boolean}>({});

  // Загружаем данные о завершенных приемах пищи при загрузке компонента
  useEffect(() => {
    const today = new Date().toDateString();
    const existingNutritionData = localStorage.getItem('nutritionData');
    
    if (existingNutritionData) {
      const nutritionData = JSON.parse(existingNutritionData);
      const todayMeals: {[key: string]: boolean} = {};
      
      nutritionData.forEach((meal: any) => {
        const mealDate = new Date(meal.date).toDateString();
        if (mealDate === today) {
          todayMeals[meal.mealType] = true;
        }
      });
      
      setCompletedMeals(todayMeals);
    }
  }, []);

  // Данные для разных типов приемов пищи
  const mealData = {
    завтрак: {
      macronutrients: { proteins: 25, fats: 12, carbs: 45 },
      time: '08:00',
      allowed: ['овсянка', 'яйца', 'творог', 'фрукты'],
      excluded: ['сладости', 'выпечка', 'газировка'],
      placeholder: 'Опишите завтрак: каша, яйца, фрукты, калорийность'
    },
    обед: {
      macronutrients: { proteins: 40, fats: 20, carbs: 60 },
      time: '13:00',
      allowed: ['курица', 'рис', 'овощи', 'суп'],
      excluded: ['фастфуд', 'жареное', 'майонез'],
      placeholder: 'Опишите обед: мясо, гарнир, овощи, калорийность'
    },
    ужин: {
      macronutrients: { proteins: 30, fats: 15, carbs: 35 },
      time: '19:00',
      allowed: ['рыба', 'гречка', 'салат', 'кефир'],
      excluded: ['углеводы', 'сладкое', 'алкоголь'],
      placeholder: 'Опишите ужин: белок, овощи, калорийность'
    },
    перекусы: {
      macronutrients: { proteins: 15, fats: 8, carbs: 25 },
      time: '10:00',
      allowed: ['орехи', 'йогурт', 'яблоко', 'творог'],
      excluded: ['печенье', 'конфеты', 'чипсы'],
      placeholder: 'Опишите перекус: фрукты, орехи, калорийность'
    }
  };

  // Получаем текущие данные для выбранного приема пищи
  const currentMealData = mealData[selectedMeal];
  
  const foodCategories: FoodCategory = {
    allowed: currentMealData.allowed,
    excluded: currentMealData.excluded
  };

  const meals = ['завтрак', 'обед', 'ужин', 'перекусы'] as const;
  const satietyLevels = ['недоедание', 'сытость', 'переедание'] as const;
  const ratingNumbers = [1, 2, 3, 4, 5];

  const handleMealChange = (newMeal: typeof selectedMeal) => {
    const currentIndex = meals.indexOf(selectedMeal);
    const newIndex = meals.indexOf(newMeal);
    
    // Определяем направление анимации
    if (newIndex > currentIndex) {
      setSlideDirection('left');
    } else if (newIndex < currentIndex) {
      setSlideDirection('right');
    }
    
    // Обновляем данные в соответствии с выбранным приемом пищи
    const newMealData = mealData[newMeal];
    setMacronutrients(newMealData.macronutrients);
    
    // Устанавливаем подходящее время для нового типа приема пищи
    let newTime = newMealData.time;
    const timeOptions = generateTimeOptions(newMeal);
    if (!timeOptions.includes(newTime)) {
      // Если время не подходит, выбираем первое доступное
      newTime = timeOptions[0];
    }
    setMealTime(newTime);
    
    // Если прием пищи уже был завершен, загружаем сохраненные данные
    if (completedMeals[newMeal]) {
      loadCompletedMealData(newMeal);
    } else {
      // Иначе сбрасываем поля
      setMealDescription('');
      setSelectedImage(null);
      setSatietyLevel('недоедание');
      setStateRating(3);
    }
    
    setSelectedMeal(newMeal);
    
    // Сбрасываем анимацию через 500ms
    setTimeout(() => {
      setSlideDirection(null);
    }, 500);
  };

  const loadCompletedMealData = (mealType: string) => {
    const existingNutritionData = localStorage.getItem('nutritionData');
    if (existingNutritionData) {
      const nutritionData = JSON.parse(existingNutritionData);
      const today = new Date().toDateString();
      
      // Ищем последний завершенный прием пищи этого типа за сегодня
      const todayMeals = nutritionData.filter((meal: any) => {
        const mealDate = new Date(meal.date).toDateString();
        return mealDate === today && meal.mealType === mealType;
      });
      
      if (todayMeals.length > 0) {
        const lastMeal = todayMeals[todayMeals.length - 1];
        setMealDescription(lastMeal.mealDescription || '');
        setSelectedImage(lastMeal.image || null);
        setSatietyLevel(lastMeal.satietyLevel || 'недоедание');
        setStateRating(lastMeal.stateRating || 3);
        setMealTime(lastMeal.mealTime || mealData[mealType].time);
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMealDescription(textarea.value);
    
    // Автоматически изменяем высоту textarea
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCompleteMeal = () => {
    // Сохраняем данные о приеме пищи
    const mealData = {
      date: new Date().toISOString(),
      mealType: selectedMeal,
      macronutrients,
      mealTime,
      mealDescription,
      satietyLevel,
      stateRating,
      image: selectedImage
    };

    // Получаем существующие данные о питании
    const existingNutritionData = localStorage.getItem('nutritionData');
    const nutritionData = existingNutritionData ? JSON.parse(existingNutritionData) : [];
    
    // Добавляем новый прием пищи
    nutritionData.push(mealData);
    localStorage.setItem('nutritionData', JSON.stringify(nutritionData));

    // Отмечаем прием пищи как завершенный
    setCompletedMeals(prev => ({
      ...prev,
      [selectedMeal]: true
    }));

    // Возвращаемся к расписанию
    navigate('/miniapp/sport-nutrition');
  };

  return (
    <div className="nutrition-container">

      {/* Основной контент */}
      <div className={`nutrition-content ${slideDirection ? `slide-${slideDirection}` : ''}`}>
        {/* Заголовок */}
        <div className="nutrition-header">
          <h1>Питание</h1>
          
          {/* Навигация по типам приемов пищи */}
          <div className="meal-navigation">
            {meals.map((meal) => (
              <button
                key={meal}
                className={`meal-tab ${selectedMeal === meal ? 'active' : ''} ${completedMeals[meal] ? 'completed' : ''}`}
                onClick={() => handleMealChange(meal)}
              >
                {meal}
                {completedMeals[meal] && <span className="completion-indicator">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Карточка с макронутриентами */}
        <div className="macronutrients-card">
          <div className="macronutrients-grid">
            <div className="macro-item">
              <div className="macro-value">{macronutrients.proteins} г</div>
              <div className="macro-label">белки</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{macronutrients.fats} г</div>
              <div className="macro-label">жиры</div>
            </div>
            <div className="macro-item">
              <div className="macro-value">{macronutrients.carbs} г</div>
              <div className="macro-label">углеводы</div>
            </div>
          </div>
        </div>

        {/* Разрешенные и исключенные продукты */}
        <div className="food-categories">
          <div className="category-section">
            <h3>разрешено</h3>
            <div className="food-tags">
              {foodCategories.allowed.map((food) => (
                <span key={food} className="food-tag allowed">
                  {food}
                </span>
              ))}
            </div>
          </div>
          
          <div className="category-section">
            <h3>исключено</h3>
            <div className="food-tags">
              {foodCategories.excluded.map((food) => (
                <span key={food} className="food-tag excluded">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Время приема пищи */}
        <div className="meal-time-section">
          <label>время приема пищи</label>
          <div className="time-input">
            <select
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="time-select"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <span className="time-arrow">▼</span>
          </div>
        </div>

        {/* Описание приема пищи */}
        <div className="meal-description-section">
          <div className="photo-upload-container">
            {selectedImage ? (
              <div className="photo-preview">
                <img src={selectedImage} alt="Фото еды" className="uploaded-photo" />
                <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                  ×
                </button>
              </div>
            ) : (
              <button className="add-button" onClick={handleAddPhotoClick}>
                <svg className="camera-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          <textarea
            placeholder={currentMealData.placeholder}
            value={mealDescription}
            onChange={handleTextareaChange}
            className="description-input"
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Уровень насыщения */}
        <div className="satiety-section">
          <div className="satiety-buttons">
            {satietyLevels.map((level) => (
              <button
                key={level}
                className={`satiety-btn ${satietyLevel === level ? 'active' : ''}`}
                onClick={() => setSatietyLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Оценка состояния */}
        <div className="state-rating-section">
          <span className="state-label">состояние</span>
          <div className="rating-numbers">
            {ratingNumbers.map((number) => (
              <button
                key={number}
                className={`rating-number ${stateRating === number ? 'active' : ''}`}
                onClick={() => setStateRating(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка завершения */}
      <button className="complete-meal-btn" onClick={handleCompleteMeal}>
        Завершить прием пищи: {selectedMeal}
      </button>
    </div>
  );
};
