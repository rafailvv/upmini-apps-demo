import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

interface UserData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  physicalActivity: 'sedentary' | 'active' | 'mixed';
  lifestyle: 'smoke' | 'lackOfSleep' | 'oversleep';
  habits: string[];
  // Данные о здоровье
  chronicDiseases: string[];
  injuries: string[];
  allergies: string[];
  medications: string[];
  // Фитнес-история
  pastSports: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  dietExperience: string[];
  // Питание
  normalDiet: string;
  mealsPerDay: '3' | '4' | '5+';
  attitudeTowards: 'love' | 'sometimes' | 'weekends';
  vegetarianism: 'no' | 'other';
  fasting: 'no';
  // Цели
  mainGoals: string[];
  specificNumbersGoal: string[];
  motivation: string[];
  // Ресурсы и условия
  workoutTime: string[];
  trainingLocation: string[];
  equipment: string[];
  budget: 'low' | 'medium' | 'high';
  // Психология
  disciplineLevel: string[];
  pastDifficulties: string[];
  supportSystem: string[];
  // Метрики контроля
  controlWeight: number;
  waist: number;
  chest: number;
  hips: number;
  biceps: number;
  thigh: number;
  bodyFat: number;
  beforePhoto: boolean;
  squats: number;
  pullUps: number;
  running: number;
  pulse: number;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    age: 28,
    gender: 'male',
    height: 178,
    weight: 82,
    physicalActivity: 'sedentary',
    lifestyle: 'lackOfSleep',
    habits: [],
    // Данные о здоровье
    chronicDiseases: [],
    injuries: [],
    allergies: [],
    medications: [],
    // Фитнес-история
    pastSports: [],
    fitnessLevel: 'intermediate',
    dietExperience: [],
    // Питание
    normalDiet: 'каша утром, мясо и овощи днём',
    mealsPerDay: '3',
    attitudeTowards: 'love',
    vegetarianism: 'no',
    fasting: 'no',
    // Цели
    mainGoals: ['похудение'],
    specificNumbersGoal: ['-7 кг'],
    motivation: ['уверенность'],
    // Ресурсы и условия
    workoutTime: ['3 раза'],
    trainingLocation: ['дом'],
    equipment: ['ничего'],
    budget: 'medium',
    // Психология
    disciplineLevel: ['мягкая поддержка'],
    pastDifficulties: ['бросал'],
    supportSystem: ['друзья'],
    // Метрики контроля
    controlWeight: 82,
    waist: 94,
    chest: 105,
    hips: 98,
    biceps: 32,
    thigh: 58,
    bodyFat: 18,
    beforePhoto: true,
    squats: 20,
    pullUps: 5,
    running: 2,
    pulse: 70
  });

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHabitToggle = (habit: string) => {
    setUserData(prev => ({
      ...prev,
      habits: prev.habits.includes(habit)
        ? prev.habits.filter(h => h !== habit)
        : [...prev.habits, habit]
    }));
  };

  const handleArrayToggle = (field: keyof UserData, item: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleNext = () => {
    // Сохраняем данные пользователя
    localStorage.setItem('userData', JSON.stringify(userData));
    // Показываем сообщение о завершении
    alert('Данные сохранены!');
  };

  const handleBack = () => {
    navigate('/miniapp/sport-nutrition');
  };

  return (
    <div className="profile-container">
      <main className="profile-main">
        {/* Заголовок */}
        <header className="profile-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Личный кабинет</h1>
        </header>

        {/* Форма */}
        <div className="profile-form">
          {/* Блок 1: Базовые данные */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Базовые данные
            </label>
            
            {/* Основные параметры */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Основные параметры
              </label>
              <div className="form-row-four">
                <div className="form-field-compact">
                  <label>Возраст</label>
                  <input
                    type="number"
                    value={userData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="form-input-compact"
                  />
                </div>
                <div className="form-field-compact">
                  <label>Пол</label>
                  <div className="button-group-compact">
                    <button
                      className={`selection-btn-compact ${userData.gender === 'male' ? 'active' : ''}`}
                      onClick={() => handleInputChange('gender', 'male')}
                    >
                      М
                    </button>
                    <button
                      className={`selection-btn-compact ${userData.gender === 'female' ? 'active' : ''}`}
                      onClick={() => handleInputChange('gender', 'female')}
                    >
                      Ж
                    </button>
                  </div>
                </div>
                <div className="form-field-compact">
                  <label>Рост</label>
                  <input
                    type="number"
                    value={userData.height}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                    className="form-input-compact"
                    placeholder="см"
                  />
                </div>
                <div className="form-field-compact">
                  <label>Вес</label>
                  <input
                    type="number"
                    value={userData.weight}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                    className="form-input-compact"
                    placeholder="кг"
                  />
                </div>
              </div>
            </div>

            {/* Физическая активность */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Физическая активность
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.physicalActivity === 'sedentary' ? 'active' : ''}`}
                  onClick={() => handleInputChange('physicalActivity', 'sedentary')}
                >
                  сидячая
                </button>
                <button
                  className={`selection-btn ${userData.physicalActivity === 'active' ? 'active' : ''}`}
                  onClick={() => handleInputChange('physicalActivity', 'active')}
                >
                  подвижная
                </button>
                <button
                  className={`selection-btn ${userData.physicalActivity === 'mixed' ? 'active' : ''}`}
                  onClick={() => handleInputChange('physicalActivity', 'mixed')}
                >
                  смешанная
                </button>
              </div>
            </div>

            {/* Образ жизни */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Образ жизни
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.lifestyle === 'smoke' ? 'active' : ''}`}
                  onClick={() => handleInputChange('lifestyle', 'smoke')}
                >
                  курю
                </button>
                <button
                  className={`selection-btn ${userData.lifestyle === 'lackOfSleep' ? 'active' : ''}`}
                  onClick={() => handleInputChange('lifestyle', 'lackOfSleep')}
                >
                  недосып
                </button>
                <button
                  className={`selection-btn ${userData.lifestyle === 'oversleep' ? 'active' : ''}`}
                  onClick={() => handleInputChange('lifestyle', 'oversleep')}
                >
                  пересып
                </button>
              </div>
            </div>

            {/* Привычки */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Привычки
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.habits.includes('курю') ? 'active' : ''}`}
                  onClick={() => handleHabitToggle('курю')}
                >
                  курю
                </button>
                <button
                  className={`selection-btn ${userData.habits.includes('алкоголь по выходным') ? 'active' : ''}`}
                  onClick={() => handleHabitToggle('алкоголь по выходным')}
                >
                  алкоголь по выходным
                </button>
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 2: Здоровье */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Здоровье
            </label>
            
            {/* Хронические заболевания */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Хронические заболевания
              </label>
              <div className="button-group">
                {['нет', 'сердце', 'суставы', 'ЖКТ'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.chronicDiseases.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('chronicDiseases', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Травмы */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Травмы
              </label>
              <div className="button-group">
                {['колени', 'спина', 'плечи', 'нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.injuries.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('injuries', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Аллергии */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Аллергии и непереносимость
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.allergies.includes('молочные продукты') ? 'active' : ''}`}
                  onClick={() => handleArrayToggle('allergies', 'молочные продукты')}
                >
                  молочные продукты
                </button>
              </div>
            </div>

            {/* Лекарства */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Лекарства / добавки
              </label>
              <div className="button-group">
                {['витамин D', 'омега-3'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.medications.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('medications', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 3: Фитнес-история */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Фитнес-история
            </label>
            
            {/* Занимался ли раньше спортом */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Занимался ли раньше спортом
              </label>
              <div className="button-group">
                {['Футбол', 'Плавание', 'Тренажёрный', 'Нет', '3 года'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.pastSports.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('pastSports', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Текущий уровень подготовки */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Текущий уровень подготовки
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'beginner' ? 'active' : ''}`}
                  onClick={() => handleInputChange('fitnessLevel', 'beginner')}
                >
                  Начинающий
                </button>
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'intermediate' ? 'active' : ''}`}
                  onClick={() => handleInputChange('fitnessLevel', 'intermediate')}
                >
                  Средний
                </button>
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'advanced' ? 'active' : ''}`}
                  onClick={() => handleInputChange('fitnessLevel', 'advanced')}
                >
                  Продвинутый
                </button>
              </div>
            </div>

            {/* Опыт диет и питания */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Опыт диет и питания
              </label>
              <div className="button-group">
                {['Кето', 'Интервальное голодание', 'Подсчёт калорий', 'Нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.dietExperience.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('dietExperience', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 4: Питание */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Питание
            </label>
            
            {/* Обычный рацион */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Обычный рацион
              </label>
              <textarea
                value={userData.normalDiet}
                onChange={(e) => handleInputChange('normalDiet', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                placeholder="Опишите ваш обычный рацион..."
              />
            </div>

            {/* Количество приёмов пищи */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Количество приёмов пищи
              </label>
              <div className="button-group">
                {['3', '4', '5+'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.mealsPerDay === item ? 'active' : ''}`}
                    onClick={() => handleInputChange('mealsPerDay', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Отношение к */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Отношение к
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'love' ? 'active' : ''}`}
                  onClick={() => handleInputChange('attitudeTowards', 'love')}
                >
                  люблю
                </button>
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'sometimes' ? 'active' : ''}`}
                  onClick={() => handleInputChange('attitudeTowards', 'sometimes')}
                >
                  иногда
                </button>
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'weekends' ? 'active' : ''}`}
                  onClick={() => handleInputChange('attitudeTowards', 'weekends')}
                >
                  по выходным
                </button>
              </div>
            </div>

            {/* Ограничения */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Ограничения
              </label>
              
              {/* Вегетарианство */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  вегетарианство
                </label>
                <div className="button-group">
                  <button
                    className={`selection-btn ${userData.vegetarianism === 'no' ? 'active' : ''}`}
                    onClick={() => handleInputChange('vegetarianism', 'no')}
                  >
                    нет
                  </button>
                  <button
                    className={`selection-btn ${userData.vegetarianism === 'other' ? 'active' : ''}`}
                    onClick={() => handleInputChange('vegetarianism', 'other')}
                  >
                    другое
                  </button>
                </div>
              </div>

              {/* Пост */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  пост
                </label>
                <div className="button-group">
                  <button
                    className={`selection-btn ${userData.fasting === 'no' ? 'active' : ''}`}
                    onClick={() => handleInputChange('fasting', 'no')}
                  >
                    нет
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 5: Цели */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Цели
            </label>
            
            {/* Главная цель */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Главная цель
              </label>
              <div className="button-group">
                {['похудение', 'набор массы', 'рельеф', 'выносливость', 'здоровье'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.mainGoals.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('mainGoals', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Конкретные цифры */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Конкретные цифры
              </label>
              <div className="button-group">
                {['-7 кг', '3 месяца', 'нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.specificNumbersGoal.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('specificNumbersGoal', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Мотивация */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Мотивация
              </label>
              <div className="button-group">
                {['для себя', 'здоровье', 'уверенность', 'внешность', 'другое'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.motivation.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('motivation', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 6: Ресурсы и условия */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Ресурсы и условия
            </label>
            
            {/* Время на тренировки */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Время на тренировки
              </label>
              <div className="button-group">
                {['1-2 раза в неделю', '3 раза', '5+'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.workoutTime.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('workoutTime', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Где будете тренироваться */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Где будете тренироваться
              </label>
              <div className="button-group">
                {['зал', 'дом', 'улица'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.trainingLocation.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('trainingLocation', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Инвентарь */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Инвентарь
              </label>
              <div className="button-group">
                {['гантели', 'резинки', 'беговая дорожка', 'ничего', 'другое', 'нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.equipment.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('equipment', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Бюджет */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Бюджет
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.budget === 'low' ? 'active' : ''}`}
                  onClick={() => handleInputChange('budget', 'low')}
                >
                  низкий
                </button>
                <button
                  className={`selection-btn ${userData.budget === 'medium' ? 'active' : ''}`}
                  onClick={() => handleInputChange('budget', 'medium')}
                >
                  средний
                </button>
                <button
                  className={`selection-btn ${userData.budget === 'high' ? 'active' : ''}`}
                  onClick={() => handleInputChange('budget', 'high')}
                >
                  высокий
                </button>
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 7: Психология */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Психология
            </label>
            
            {/* Уровень дисциплины */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Уровень дисциплины
              </label>
              <div className="button-group">
                {['мягкая поддержка', 'строгий контроль', 'напоминания', 'геймификация'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.disciplineLevel.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('disciplineLevel', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Трудности раньше */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Трудности раньше
              </label>
              <div className="button-group">
                {['бросал', 'не хватало времени', 'нет мотивации', 'другое'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.pastDifficulties.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('pastDifficulties', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Кто поддерживает */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Кто поддерживает
              </label>
              <div className="button-group">
                {['семья', 'друзья', 'сам', 'никто', 'мешают'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.supportSystem.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('supportSystem', item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Разделитель между блоками */}
          <div style={{ 
            height: '1px', 
            background: '#E5E7EB', 
            margin: '32px 0',
            borderRadius: '1px'
          }}></div>

          {/* Блок 8: Метрики контроля */}
          <div className="form-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Метрики контроля
            </label>
            
            {/* Стартовые замеры */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                Стартовые замеры
              </label>
              
              {/* Вес */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>вес</span>
                <input
                  type="number"
                  value={userData.controlWeight}
                  onChange={(e) => handleInputChange('controlWeight', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>кг</span>
              </div>
              
              {/* Талия */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>талия</span>
                <input
                  type="number"
                  value={userData.waist}
                  onChange={(e) => handleInputChange('waist', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>см</span>
              </div>
              
              {/* Грудь */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>грудь</span>
                <input
                  type="number"
                  value={userData.chest}
                  onChange={(e) => handleInputChange('chest', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>см</span>
              </div>
              
              {/* Бёдра */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>бёдра</span>
                <input
                  type="number"
                  value={userData.hips}
                  onChange={(e) => handleInputChange('hips', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>см</span>
              </div>
              
              {/* Бицепс */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>бицепс</span>
                <input
                  type="number"
                  value={userData.biceps}
                  onChange={(e) => handleInputChange('biceps', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>см</span>
              </div>
              
              {/* Бедро */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>бедро</span>
                <input
                  type="number"
                  value={userData.thigh}
                  onChange={(e) => handleInputChange('thigh', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>см</span>
              </div>
              
              {/* Процент жира */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>% жира</span>
                <input
                  type="number"
                  value={userData.bodyFat}
                  onChange={(e) => handleInputChange('bodyFat', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>%</span>
              </div>
              
              {/* Фото "до" */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>фото «до»</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
                    {userData.beforePhoto ? 'дано' : 'не дано'}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Спортивные тесты */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                Спортивные тесты
              </label>
              
              {/* Приседания */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>приседания</span>
                <input
                  type="number"
                  value={userData.squats}
                  onChange={(e) => handleInputChange('squats', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
              </div>
              
              {/* Подтягивания */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>подтягивания</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={userData.pullUps}
                    onChange={(e) => handleInputChange('pullUps', parseInt(e.target.value) || 0)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1F2937',
                      textAlign: 'right',
                      width: '40px'
                    }}
                  />
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Бег */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>бег</span>
                <input
                  type="number"
                  value={userData.running}
                  onChange={(e) => handleInputChange('running', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>км</span>
              </div>
              
              {/* Пульс */}
              <div style={{ 
                background: '#F9FAFB', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>пульс</span>
                <input
                  type="number"
                  value={userData.pulse}
                  onChange={(e) => handleInputChange('pulse', parseInt(e.target.value) || 0)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    textAlign: 'right',
                    width: '60px'
                  }}
                />
              </div>
            </div>

            {/* Как отслеживаем прогресс */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                Как отслеживаем прогресс
              </label>
              
              <button style={{
                width: '100%',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
                еженедельный отчёт
              </button>
              
              <div style={{ 
                textAlign: 'center',
                fontSize: '12px',
                color: '#6B7280'
              }}>
                замеры раз в месяц
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка "Далее" */}
        <div className="profile-actions">
          <button className="next-btn" onClick={handleNext}>
            Далее
          </button>
        </div>
      </main>
    </div>
  );
};
