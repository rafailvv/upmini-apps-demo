import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import './Profile.css';

interface UserData {
  firstName: string;
  lastName: string;
  age: number | '';
  gender: 'male' | 'female' | '';
  height: number | '';
  weight: number | '';
  physicalActivity: 'sedentary' | 'active' | 'mixed' | 'other' | '';
  physicalActivityOther: string;
  lifestyle: 'healthy' | 'lackOfSleep' | 'oversleep' | 'other' | '';
  lifestyleOther: string;
  habits: string[];
  habitsOther: string;
  // Данные о здоровье
  chronicDiseases: string[];
  chronicDiseasesOther: string;
  injuries: string[];
  injuriesOther: string;
  allergies: string[];
  allergiesOther: string;
  medications: string[];
  medicationsOther: string;
  // Фитнес-история
  pastSports: string[];
  pastSportsOther: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'other' | '';
  fitnessLevelOther: string;
  dietExperience: string[];
  dietExperienceOther: string;
  // Питание
  normalDiet: string;
  mealsPerDay: '3' | '4' | '5+' | 'other' | '';
  mealsPerDayOther: string;
  attitudeTowards: 'love' | 'sometimes' | 'weekends' | 'other' | '';
  attitudeTowardsOther: string;
  restrictions: 'vegetarianism' | 'fasting' | 'diabetes' | 'other' | '';
  restrictionsOther: string;
  // Цели
  mainGoals: string[];
  mainGoalsOther: string;
  weightGoal: number;
  weightGoalType: 'gain' | 'loss';
  timeGoal: number;
  timeGoalUnit: 'weeks' | 'months';
  motivation: string[];
  motivationOther: string;
  // Ресурсы и условия
  workoutTime: string[];
  workoutTimeOther: string;
  trainingLocation: string[];
  trainingLocationOther: string;
  equipment: string[];
  equipmentOther: string;
  budget: 'yes' | 'no' | '';
  // Психология
  disciplineLevel: string[];
  disciplineLevelOther: string;
  pastDifficulties: string[];
  pastDifficultiesOther: string;
  supportSystem: string[];
  supportSystemOther: string;
  // Метрики контроля
  controlWeight: number;
  waist: number;
  chest: number;
  hips: number;
  biceps: number;
  thigh: number;
  bodyFat: number;
  beforePhoto: boolean;
  beforePhotoFile?: string; // base64 строка
  squats: number;
  pullUps: number;
  running: number;
  pulse: number;
  // Флаги для метрик
  hasWeight: boolean;
  hasWaist: boolean;
  hasChest: boolean;
  hasHips: boolean;
  hasBiceps: boolean;
  hasThigh: boolean;
  hasBodyFat: boolean;
  hasSquats: boolean;
  hasPullUps: boolean;
  hasRunning: boolean;
  hasPulse: boolean;
  // Промежуточные результаты
  intermediateResults: Array<{
    id: string;
    date: string;
    weight?: number;
    waist?: number;
    chest?: number;
    hips?: number;
    biceps?: number;
    thigh?: number;
    bodyFat?: number;
    squats?: number;
    pullUps?: number;
    running?: number;
    pulse?: number;
    photoFile?: string; // base64 строка
  }>;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [showIntermediateForm, setShowIntermediateForm] = useState(false);
  const [intermediateFormData, setIntermediateFormData] = useState({
    weight: '',
    waist: '',
    chest: '',
    hips: '',
    biceps: '',
    thigh: '',
    bodyFat: '',
    squats: '',
    pullUps: '',
    running: '',
    pulse: '',
    photoFile: null as File | null,
    photoFileName: ''
  });
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<{ data: string; name: string } | null>(null);

  // Функция для конвертации File в base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Функция для сохранения результата
  const saveResult = (resultData: any) => {
    if (editingResultId) {
      // Обновляем существующий результат
      setUserData(prev => {
        const newData = {
          ...prev,
          intermediateResults: prev.intermediateResults.map(result =>
            result.id === editingResultId
              ? { ...result, ...resultData }
              : result
          )
        };
        localStorage.setItem('userData', JSON.stringify(newData));
        return newData;
      });
      setEditingResultId(null);
    } else {
      // Создаем новый результат
      const newResult = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        ...resultData
      };

      setUserData(prev => {
        const newData = {
          ...prev,
          intermediateResults: [...prev.intermediateResults, newResult]
        };
        localStorage.setItem('userData', JSON.stringify(newData));
        return newData;
      });
    }

    // Очищаем форму
    setIntermediateFormData({
      weight: '',
      waist: '',
      chest: '',
      hips: '',
      biceps: '',
      thigh: '',
      bodyFat: '',
      squats: '',
      pullUps: '',
      running: '',
      pulse: '',
      photoFile: null,
      photoFileName: ''
    });

    setShowIntermediateForm(false);
  };
  const [userData, setUserData] = useState<UserData>(() => {
    // Загружаем данные из localStorage при инициализации
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error);
      }
    }
    
    // Возвращаем данные по умолчанию, если нет сохраненных данных
    return {
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      physicalActivity: '',
      physicalActivityOther: '',
      lifestyle: '',
      lifestyleOther: '',
      habits: [],
      habitsOther: '',
      // Данные о здоровье
      chronicDiseases: [],
      chronicDiseasesOther: '',
      injuries: [],
      injuriesOther: '',
      allergies: [],
      allergiesOther: '',
      medications: [],
      medicationsOther: '',
      // Фитнес-история
      pastSports: [],
      pastSportsOther: '',
      fitnessLevel: '',
      fitnessLevelOther: '',
      dietExperience: [],
      dietExperienceOther: '',
      // Питание
      normalDiet: 'каша утром, мясо и овощи днём',
      mealsPerDay: '',
      mealsPerDayOther: '',
      attitudeTowards: '',
      attitudeTowardsOther: '',
      restrictions: '',
      restrictionsOther: '',
      // Цели
      mainGoals: ['похудение'],
      mainGoalsOther: '',
      weightGoal: 7,
      weightGoalType: 'loss',
      timeGoal: 3,
      timeGoalUnit: 'months',
      motivation: ['уверенность'],
      motivationOther: '',
      // Ресурсы и условия
      workoutTime: ['3 раза'],
      workoutTimeOther: '',
      trainingLocation: ['дом'],
      trainingLocationOther: '',
      equipment: ['ничего'],
      equipmentOther: '',
      budget: '',
      // Психология
      disciplineLevel: ['мягкая поддержка'],
      disciplineLevelOther: '',
      pastDifficulties: ['бросал'],
      pastDifficultiesOther: '',
      supportSystem: ['друзья'],
      supportSystemOther: '',
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
      pulse: 70,
      // Флаги для метрик
      hasWeight: true,
      hasWaist: true,
      hasChest: true,
      hasHips: true,
      hasBiceps: true,
      hasThigh: true,
      hasBodyFat: true,
      hasSquats: true,
      hasPullUps: true,
      hasRunning: true,
      hasPulse: true,
      // Промежуточные результаты
      intermediateResults: []
    };
  });

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      // Сохраняем в localStorage при каждом изменении
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSelectionToggle = (field: keyof UserData, value: any) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        [field]: prev[field] === value ? '' : value
      };
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleHabitToggle = (habit: string) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        habits: prev.habits.includes(habit)
          ? prev.habits.filter(h => h !== habit)
          : [...prev.habits, habit]
      };
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleArrayToggle = (field: keyof UserData, item: string) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        [field]: (prev[field] as string[]).includes(item)
          ? (prev[field] as string[]).filter(i => i !== item)
          : [...(prev[field] as string[]), item]
      };
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleArrayOtherToggle = (field: keyof UserData, otherField: keyof UserData) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        [field]: (prev[field] as string[]).includes('другое')
          ? (prev[field] as string[]).filter(i => i !== 'другое')
          : [...(prev[field] as string[]), 'другое'],
        [otherField]: ''
      };
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleArrayOtherInput = (_field: keyof UserData, otherField: keyof UserData, value: string) => {
    setUserData(prev => {
      const newData = {
        ...prev,
        [otherField]: value
      };
      localStorage.setItem('userData', JSON.stringify(newData));
      return newData;
    });
  };



  const handleNext = () => {
    // Переходим на страницу "Мое расписание"
    navigate('/miniapp/sport-nutrition/schedule');
  };

  const handleDownloadPDF = () => {
    // Отладочная информация
    console.log('=== PDF DEBUG INFO ===');
    console.log('beforePhoto:', userData.beforePhoto);
    console.log('beforePhotoFile type:', typeof userData.beforePhotoFile);
    console.log('beforePhotoFile:', userData.beforePhotoFile);
    console.log('beforePhotoFile length:', userData.beforePhotoFile?.length);
    console.log('beforePhotoFile starts with data:', userData.beforePhotoFile?.startsWith('data:'));
    console.log('beforePhotoFile first 100 chars:', userData.beforePhotoFile?.substring(0, 100));
    console.log('=== END DEBUG INFO ===');
    
    // Создаем HTML контент для PDF
    const pdfContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Личный кабинет</title>
          <style>
            @page {
              margin: 2cm;
              size: A4;
            }
            
            @media print {
              body {
                padding: 20px 20px 0 20px;
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
            
            .field { 
              margin-bottom: 12px;
              display: flex;
              align-items: baseline;
            }
            
            .label { 
              font-weight: 600; 
              color: #374151;
              min-width: 200px;
              margin-right: 15px;
            }
            
            .value { 
              color: #1F2937;
              font-weight: 400;
            }
            
            .list { 
              margin: 8px 0;
              padding-left: 20px;
            }
            
            .list-item { 
              margin: 4px 0;
              position: relative;
            }
            
            .list-item:before {
              content: "•";
              color: #1E40AF;
              font-weight: bold;
              position: absolute;
              left: -15px;
            }
            
            .intermediate-result { 
              margin: 15px 0; 
              padding: 20px; 
              border: 2px solid #E5E7EB; 
              border-radius: 12px;
              background: #F9FAFB;
              page-break-inside: avoid;
            }
            
            .result-header {
              font-weight: 600;
              color: #1E40AF;
              font-size: 16px;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 10px;
              margin: 15px 0;
            }
            
            .metric-item {
              background: white;
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid #E5E7EB;
            }
            
            .photo-container { 
              margin: 15px 0; 
              text-align: center;
              page-break-inside: avoid;
            }
            
            .photo { 
              max-width: 100%; 
              max-height: 300px; 
              border: 2px solid #E5E7EB; 
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .photo-label {
              font-weight: 600;
              color: #374151;
              margin-bottom: 10px;
              font-size: 14px;
            }
            
            .empty-value {
              color: #9CA3AF;
              font-style: italic;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              color: #6B7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Личный кабинет</h1>
            <p class="subtitle">Отчет о состоянии здоровья и фитнес-прогрессе</p>
          </div>
          
          <div class="section">
            <h2>Базовые данные</h2>
            ${userData.firstName || userData.lastName ? `
            <div class="field">
              <span class="label">Имя:</span> <span class="value">${userData.firstName} ${userData.lastName}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Возраст:</span> <span class="value">${userData.age || '—'} ${userData.age ? 'лет' : ''}</span>
            </div>
            <div class="field">
              <span class="label">Пол:</span> <span class="value">${userData.gender === 'male' ? 'Мужской' : userData.gender === 'female' ? 'Женский' : '—'}</span>
            </div>
            <div class="field">
              <span class="label">Рост:</span> <span class="value">${userData.height || '—'} ${userData.height ? 'см' : ''}</span>
            </div>
            <div class="field">
              <span class="label">Вес:</span> <span class="value">${userData.weight || '—'} ${userData.weight ? 'кг' : ''}</span>
            </div>
            <div class="field">
              <span class="label">Физическая активность:</span> <span class="value">${
                userData.physicalActivity === 'sedentary' ? 'Малоподвижный' :
                userData.physicalActivity === 'active' ? 'Активный' :
                userData.physicalActivity === 'mixed' ? 'Смешанный' :
                userData.physicalActivity === 'other' ? userData.physicalActivityOther : '—'
              }</span>
            </div>
            <div class="field">
              <span class="label">Образ жизни:</span> <span class="value">${
                userData.lifestyle === 'healthy' ? 'ЗОЖ' :
                userData.lifestyle === 'lackOfSleep' ? 'Недостаток сна' :
                userData.lifestyle === 'oversleep' ? 'Пересыпание' :
                userData.lifestyle === 'other' ? userData.lifestyleOther : '—'
              }</span>
            </div>
            ${userData.habits.length > 0 ? `
            <div class="field">
              <span class="label">Привычки:</span>
              <div class="list">
                ${userData.habits.map(habit => `<div class="list-item">• ${habit}</div>`).join('')}
                ${userData.habits.includes('другое') && userData.habitsOther ? `<div class="list-item">• ${userData.habitsOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Здоровье</h2>
            ${userData.chronicDiseases.length > 0 ? `
            <div class="field">
              <span class="label">Хронические заболевания:</span>
              <div class="list">
                ${userData.chronicDiseases.map(disease => `<div class="list-item">• ${disease}</div>`).join('')}
                ${userData.chronicDiseases.includes('другое') && userData.chronicDiseasesOther ? `<div class="list-item">• ${userData.chronicDiseasesOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.injuries.length > 0 ? `
            <div class="field">
              <span class="label">Травмы:</span>
              <div class="list">
                ${userData.injuries.map(injury => `<div class="list-item">• ${injury}</div>`).join('')}
                ${userData.injuries.includes('другое') && userData.injuriesOther ? `<div class="list-item">• ${userData.injuriesOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.allergies.length > 0 ? `
            <div class="field">
              <span class="label">Аллергии:</span>
              <div class="list">
                ${userData.allergies.map(allergy => `<div class="list-item">• ${allergy}</div>`).join('')}
                ${userData.allergies.includes('другое') && userData.allergiesOther ? `<div class="list-item">• ${userData.allergiesOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.medications.length > 0 ? `
            <div class="field">
              <span class="label">Лекарства:</span>
              <div class="list">
                ${userData.medications.map(med => `<div class="list-item">• ${med}</div>`).join('')}
                ${userData.medications.includes('другое') && userData.medicationsOther ? `<div class="list-item">• ${userData.medicationsOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Фитнес-история</h2>
            ${userData.pastSports.length > 0 ? `
            <div class="field">
              <span class="label">Занимался ли раньше спортом:</span>
              <div class="list">
                ${userData.pastSports.map(sport => `<div class="list-item">• ${sport}</div>`).join('')}
                ${userData.pastSports.includes('другое') && userData.pastSportsOther ? `<div class="list-item">• ${userData.pastSportsOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Текущий уровень подготовки:</span> <span class="value">${
                userData.fitnessLevel === 'beginner' ? 'Начинающий' :
                userData.fitnessLevel === 'intermediate' ? 'Средний' :
                userData.fitnessLevel === 'advanced' ? 'Продвинутый' :
                userData.fitnessLevel === 'other' ? userData.fitnessLevelOther : '—'
              }</span>
            </div>
            ${userData.dietExperience.length > 0 ? `
            <div class="field">
              <span class="label">Опыт диет и питания:</span>
              <div class="list">
                ${userData.dietExperience.map(diet => `<div class="list-item">• ${diet}</div>`).join('')}
                ${userData.dietExperience.includes('другое') && userData.dietExperienceOther ? `<div class="list-item">• ${userData.dietExperienceOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Питание</h2>
            <div class="field">
              <span class="label">Обычный рацион:</span> <span class="value">${userData.normalDiet}</span>
            </div>
            <div class="field">
              <span class="label">Приемов пищи в день:</span> <span class="value">${
                userData.mealsPerDay === 'other' ? userData.mealsPerDayOther : userData.mealsPerDay || '—'
              }</span>
            </div>
            <div class="field">
              <span class="label">Отношение к алкоголю:</span> <span class="value">${
                userData.attitudeTowards === 'love' ? 'Люблю' :
                userData.attitudeTowards === 'sometimes' ? 'Иногда' :
                userData.attitudeTowards === 'weekends' ? 'По выходным' :
                userData.attitudeTowards === 'other' ? userData.attitudeTowardsOther : '—'
              }</span>
            </div>
            ${userData.restrictions ? `
            <div class="field">
              <span class="label">Ограничения:</span> <span class="value">${
                userData.restrictions === 'vegetarianism' ? 'Вегетарианство' :
                userData.restrictions === 'fasting' ? 'Пост' :
                userData.restrictions === 'diabetes' ? 'Сахарный диабет' :
                userData.restrictions === 'other' ? userData.restrictionsOther : '—'
              }</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Цели</h2>
            ${userData.mainGoals.length > 0 ? `
            <div class="field">
              <span class="label">Основные цели:</span>
              <div class="list">
                ${userData.mainGoals.map(goal => `<div class="list-item">• ${goal}</div>`).join('')}
                ${userData.mainGoals.includes('другое') && userData.mainGoalsOther ? `<div class="list-item">• ${userData.mainGoalsOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Конкретные числовые цели:</span> <span class="value">${
                userData.weightGoalType === 'loss' ? '-' : '+'
              }${userData.weightGoal} кг за ${userData.timeGoal} ${
                userData.timeGoalUnit === 'weeks' ? 'недель' : 'месяцев'
              }</span>
            </div>
            ${userData.motivation.length > 0 ? `
            <div class="field">
              <span class="label">Мотивация:</span>
              <div class="list">
                ${userData.motivation.map(mot => `<div class="list-item">• ${mot}</div>`).join('')}
                ${userData.motivation.includes('другое') && userData.motivationOther ? `<div class="list-item">• ${userData.motivationOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Ресурсы и условия</h2>
            ${userData.workoutTime.length > 0 ? `
            <div class="field">
              <span class="label">Время для тренировок:</span>
              <div class="list">
                ${userData.workoutTime.map(time => `<div class="list-item">• ${time}</div>`).join('')}
                ${userData.workoutTime.includes('другое') && userData.workoutTimeOther ? `<div class="list-item">• ${userData.workoutTimeOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.trainingLocation.length > 0 ? `
            <div class="field">
              <span class="label">Место тренировок:</span>
              <div class="list">
                ${userData.trainingLocation.map(location => `<div class="list-item">• ${location}</div>`).join('')}
                ${userData.trainingLocation.includes('другое') && userData.trainingLocationOther ? `<div class="list-item">• ${userData.trainingLocationOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.equipment.length > 0 ? `
            <div class="field">
              <span class="label">Оборудование:</span>
              <div class="list">
                ${userData.equipment.map(equip => `<div class="list-item">• ${equip}</div>`).join('')}
                ${userData.equipment.includes('другое') && userData.equipmentOther ? `<div class="list-item">• ${userData.equipmentOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Бюджет на докупку инвентаря:</span> <span class="value">${
                userData.budget === 'yes' ? 'Да' : userData.budget === 'no' ? 'Нет' : '—'
              }</span>
            </div>
          </div>

          <div class="section">
            <h2>Психология</h2>
            ${userData.disciplineLevel.length > 0 ? `
            <div class="field">
              <span class="label">Уровень дисциплины:</span>
              <div class="list">
                ${userData.disciplineLevel.map(level => `<div class="list-item">• ${level}</div>`).join('')}
                ${userData.disciplineLevel.includes('другое') && userData.disciplineLevelOther ? `<div class="list-item">• ${userData.disciplineLevelOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.pastDifficulties.length > 0 ? `
            <div class="field">
              <span class="label">Прошлые трудности:</span>
              <div class="list">
                ${userData.pastDifficulties.map(diff => `<div class="list-item">• ${diff}</div>`).join('')}
                ${userData.pastDifficulties.includes('другое') && userData.pastDifficultiesOther ? `<div class="list-item">• ${userData.pastDifficultiesOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
            ${userData.supportSystem.length > 0 ? `
            <div class="field">
              <span class="label">Система поддержки:</span>
              <div class="list">
                ${userData.supportSystem.map(support => `<div class="list-item">• ${support}</div>`).join('')}
                ${userData.supportSystem.includes('другое') && userData.supportSystemOther ? `<div class="list-item">• ${userData.supportSystemOther}</div>` : ''}
              </div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <h2>Метрики контроля</h2>
            
            <div class="field">
              <span class="label">Стартовые замеры:</span>
            </div>
            <div class="metrics-grid">
              ${userData.hasWeight ? `<div class="metric-item">Вес: ${userData.controlWeight || '—'} кг</div>` : ''}
              ${userData.hasWaist ? `<div class="metric-item">Талия: ${userData.waist || '—'} см</div>` : ''}
              ${userData.hasChest ? `<div class="metric-item">Грудь: ${userData.chest || '—'} см</div>` : ''}
              ${userData.hasHips ? `<div class="metric-item">Бёдра: ${userData.hips || '—'} см</div>` : ''}
              ${userData.hasBiceps ? `<div class="metric-item">Бицепс: ${userData.biceps || '—'} см</div>` : ''}
              ${userData.hasThigh ? `<div class="metric-item">Бедро: ${userData.thigh || '—'} см</div>` : ''}
              ${userData.hasBodyFat ? `<div class="metric-item">% жира: ${userData.bodyFat || '—'}%</div>` : ''}
            </div>
            
            <div class="field">
              <span class="label">Спортивные тесты:</span>
            </div>
            <div class="metrics-grid">
              ${userData.hasSquats ? `<div class="metric-item">Приседания: ${userData.squats || '—'}</div>` : ''}
              ${userData.hasPullUps ? `<div class="metric-item">Подтягивания: ${userData.pullUps || '—'}</div>` : ''}
              ${userData.hasRunning ? `<div class="metric-item">Бег: ${userData.running || '—'} км</div>` : ''}
              ${userData.hasPulse ? `<div class="metric-item">Пульс: ${userData.pulse || '—'}</div>` : ''}
            </div>
            
            ${userData.beforePhoto ? `
            <div class="field">
              <span class="label">Фото "До":</span>
            </div>
            ${userData.beforePhotoFile && userData.beforePhotoFile.length > 0 ? `
            <div class="photo-container">
              <div class="photo-label">Фотография до начала программы</div>
              <img src="${userData.beforePhotoFile}" alt="Фото до" class="photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div style="display: none; color: #6B7280; font-style: italic;">• Фото загружено (не удалось отобразить)</div>
            </div>
            ` : '<div class="field">• Фото загружено (данные отсутствуют)</div>'}
            ` : ''}
          </div>
          
          ${userData.intermediateResults.length > 0 ? `
          <div class="section">
            <h2>Промежуточные результаты</h2>
            ${userData.intermediateResults.map(result => `
            <div class="intermediate-result">
              <div class="result-header">Результат от ${result.date}</div>
              
              <div class="metrics-grid">
                ${result.weight ? `<div class="metric-item">Вес: ${result.weight} кг</div>` : ''}
                ${result.waist ? `<div class="metric-item">Талия: ${result.waist} см</div>` : ''}
                ${result.chest ? `<div class="metric-item">Грудь: ${result.chest} см</div>` : ''}
                ${result.hips ? `<div class="metric-item">Бёдра: ${result.hips} см</div>` : ''}
                ${result.biceps ? `<div class="metric-item">Бицепс: ${result.biceps} см</div>` : ''}
                ${result.thigh ? `<div class="metric-item">Бедро: ${result.thigh} см</div>` : ''}
                ${result.bodyFat ? `<div class="metric-item">% жира: ${result.bodyFat}%</div>` : ''}
                ${result.squats ? `<div class="metric-item">Приседания: ${result.squats}</div>` : ''}
                ${result.pullUps ? `<div class="metric-item">Подтягивания: ${result.pullUps}</div>` : ''}
                ${result.running ? `<div class="metric-item">Бег: ${result.running} км</div>` : ''}
                ${result.pulse ? `<div class="metric-item">Пульс: ${result.pulse}</div>` : ''}
              </div>
              
              ${result.photoFile && result.photoFile.length > 0 ? `
              <div class="photo-container">
                <div class="photo-label">Фотография промежуточного результата</div>
                <img src="${result.photoFile}" alt="Фото промежуточного результата" class="photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                <div style="display: none; color: #6B7280; font-style: italic;">• Фото загружено (не удалось отобразить)</div>
              </div>
              ` : result.photoFile ? '<div class="field">• Фото загружено (данные отсутствуют)</div>' : ''}
            </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Отчет сгенерирован автоматически</p>
            <p>Дата создания: ${new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </body>
      </html>
    `;

    // Создаем blob с HTML контентом
    const blob = new Blob([pdfContent], { type: 'text/html' });
    
    // Создаем ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'личный_кабинет.html';
    
    // Добавляем ссылку в DOM и кликаем по ней
    document.body.appendChild(link);
    link.click();
    
    // Очищаем
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert('Файл сохранен! Вы можете открыть его в браузере и распечатать как PDF.');
  };



  return (
    <div className="profile-container" style={{
      minHeight: '100vh',
      background: '#1E40AF',
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      <main className="profile-main" style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Заголовок */}
        <header className="profile-header" style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 className="profile-title">Личный кабинет</h1>
          <button
            className="download-pdf-btn"
            onClick={handleDownloadPDF}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V11M8 11L4 7M8 11L12 7M2 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Скачать PDF
          </button>
        </header>

        {/* Форма */}
        <div className="profile-form" style={{
          padding: '32px'
        }}>
          {/* Блок 1: Базовые данные */}
          <div className="form-section basic-data-section">
            <label className="section-label" style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', marginBottom: '16px' }}>
              Базовые данные
            </label>
            
            {/* Имя и Фамилия */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Имя и Фамилия
              </label>
              <div className="form-row-four">
                <div className="form-field-compact">
                  <label>Имя</label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="form-input-compact"
                    placeholder="Введите имя"
                  />
                </div>
                <div className="form-field-compact">
                  <label>Фамилия</label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="form-input-compact"
                    placeholder="Введите фамилию"
                  />
                </div>
              </div>
            </div>

            {/* Возраст и Пол */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Возраст и Пол
              </label>
              <div className="form-row-four">
                <div className="form-field-compact">
                  <label>Возраст</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={userData.age || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('age', value === '' ? '' : parseInt(value) || '');
                    }}
                    className="form-input-compact"
                  />
                </div>
                <div className="form-field-compact">
                  <label>Пол</label>
                  <div className="button-group-compact">
                    <button
                      className={`selection-btn-compact ${userData.gender === 'male' ? 'active' : ''}`}
                      onClick={() => handleSelectionToggle('gender', 'male')}
                    >
                      М
                    </button>
                    <button
                      className={`selection-btn-compact ${userData.gender === 'female' ? 'active' : ''}`}
                      onClick={() => handleSelectionToggle('gender', 'female')}
                    >
                      Ж
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Рост и Вес */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Рост и Вес
              </label>
              <div className="form-row-four">
                <div className="form-field-compact">
                  <label>Рост</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={userData.height || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('height', value === '' ? '' : parseInt(value) || '');
                    }}
                    className="form-input-compact"
                    placeholder="См"
                  />
                </div>
                <div className="form-field-compact">
                  <label>Вес</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={userData.weight || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('weight', value === '' ? '' : parseInt(value) || '');
                    }}
                    className="form-input-compact"
                    placeholder="Кг"
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
                  onClick={() => handleSelectionToggle('physicalActivity', 'sedentary')}
                >
                  сидячая
                </button>
                <button
                  className={`selection-btn ${userData.physicalActivity === 'active' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('physicalActivity', 'active')}
                >
                  подвижная
                </button>
                <button
                  className={`selection-btn ${userData.physicalActivity === 'mixed' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('physicalActivity', 'mixed')}
                >
                  смешанная
                </button>
                <button
                  className={`selection-btn ${userData.physicalActivity === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('physicalActivity', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.physicalActivity === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.physicalActivityOther}
                    onChange={(e) => handleInputChange('physicalActivityOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите вашу физическую активность"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Образ жизни */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Образ жизни
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.lifestyle === 'healthy' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('lifestyle', 'healthy')}
                >
                  ЗОЖ
                </button>
                <button
                  className={`selection-btn ${userData.lifestyle === 'lackOfSleep' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('lifestyle', 'lackOfSleep')}
                >
                  недосып
                </button>
                <button
                  className={`selection-btn ${userData.lifestyle === 'oversleep' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('lifestyle', 'oversleep')}
                >
                  пересып
                </button>
                <button
                  className={`selection-btn ${userData.lifestyle === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('lifestyle', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.lifestyle === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.lifestyleOther}
                    onChange={(e) => handleInputChange('lifestyleOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваш образ жизни"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.habits.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('habits', 'habitsOther')}
                >
                  другое
                </button>
              </div>
              {userData.habits.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.habitsOther}
                    onChange={(e) => handleArrayOtherInput('habits', 'habitsOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши привычки"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.chronicDiseases.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('chronicDiseases', 'chronicDiseasesOther')}
                >
                  другое
                </button>
              </div>
              {userData.chronicDiseases.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.chronicDiseasesOther}
                    onChange={(e) => handleArrayOtherInput('chronicDiseases', 'chronicDiseasesOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши заболевания"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.injuries.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('injuries', 'injuriesOther')}
                >
                  другое
                </button>
              </div>
              {userData.injuries.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.injuriesOther}
                    onChange={(e) => handleArrayOtherInput('injuries', 'injuriesOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши травмы"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.allergies.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('allergies', 'allergiesOther')}
                >
                  другое
                </button>
              </div>
              {userData.allergies.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.allergiesOther}
                    onChange={(e) => handleArrayOtherInput('allergies', 'allergiesOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши аллергии"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.medications.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('medications', 'medicationsOther')}
                >
                  другое
                </button>
              </div>
              {userData.medications.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.medicationsOther}
                    onChange={(e) => handleArrayOtherInput('medications', 'medicationsOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши лекарства/добавки"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                {['Футбол', 'Плавание', 'Тренажёрный', 'Нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.pastSports.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('pastSports', item)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className={`selection-btn ${userData.pastSports.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('pastSports', 'pastSportsOther')}
                >
                  другое
                </button>
              </div>
              {userData.pastSports.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.pastSportsOther}
                    onChange={(e) => handleArrayOtherInput('pastSports', 'pastSportsOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваш спортивный опыт"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Текущий уровень подготовки */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Текущий уровень подготовки
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'beginner' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('fitnessLevel', 'beginner')}
                >
                  Начинающий
                </button>
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'intermediate' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('fitnessLevel', 'intermediate')}
                >
                  Средний
                </button>
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'advanced' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('fitnessLevel', 'advanced')}
                >
                  Продвинутый
                </button>
                <button
                  className={`selection-btn ${userData.fitnessLevel === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('fitnessLevel', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.fitnessLevel === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.fitnessLevelOther}
                    onChange={(e) => handleInputChange('fitnessLevelOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваш уровень подготовки"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                <button
                  className={`selection-btn ${userData.dietExperience.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('dietExperience', 'dietExperienceOther')}
                >
                  другое
                </button>
              </div>
              {userData.dietExperience.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.dietExperienceOther}
                    onChange={(e) => handleArrayOtherInput('dietExperience', 'dietExperienceOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваш опыт диет"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
                {['2', '3', '4', '5+'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.mealsPerDay === item ? 'active' : ''}`}
                    onClick={() => handleSelectionToggle('mealsPerDay', item)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className={`selection-btn ${userData.mealsPerDay === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('mealsPerDay', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.mealsPerDay === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.mealsPerDayOther}
                    onChange={(e) => handleInputChange('mealsPerDayOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите количество приёмов пищи"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Отношение к алкоголю */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Отношение к алкоголю
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'love' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('attitudeTowards', 'love')}
                >
                  люблю
                </button>
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'sometimes' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('attitudeTowards', 'sometimes')}
                >
                  иногда
                </button>
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'weekends' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('attitudeTowards', 'weekends')}
                >
                  по выходным
                </button>
                <button
                  className={`selection-btn ${userData.attitudeTowards === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('attitudeTowards', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.attitudeTowards === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.attitudeTowardsOther}
                    onChange={(e) => handleInputChange('attitudeTowardsOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваше отношение к еде"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Ограничения */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Ограничения
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.restrictions === 'vegetarianism' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('restrictions', 'vegetarianism')}
                >
                  вегетарианство
                </button>
                <button
                  className={`selection-btn ${userData.restrictions === 'fasting' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('restrictions', 'fasting')}
                >
                  пост
                </button>
                <button
                  className={`selection-btn ${userData.restrictions === 'diabetes' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('restrictions', 'diabetes')}
                >
                  сахарный диабет
                </button>
                <button
                  className={`selection-btn ${userData.restrictions === 'other' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('restrictions', 'other')}
                >
                  другое
                </button>
              </div>
              {userData.restrictions === 'other' && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.restrictionsOther}
                    onChange={(e) => handleInputChange('restrictionsOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваши ограничения"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
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
              
              {/* Цель по весу */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  Цель по весу
                </label>
                <div className="form-row-four">
                  <div className="form-field-compact">
                    <input
                      type="number"
                      value={userData.weightGoal}
                      onChange={(e) => handleInputChange('weightGoal', parseInt(e.target.value) || 0)}
                      className="form-input-compact"
                      placeholder="Кг"
                      min="0"
                    />
                  </div>
                  <div className="form-field-compact">
                    <div className="button-group-compact">
                      <button
                        className={`selection-btn-compact ${userData.weightGoalType === 'loss' ? 'active' : ''}`}
                        onClick={() => handleSelectionToggle('weightGoalType', 'loss')}
                      >
                        сбросить
                      </button>
                      <button
                        className={`selection-btn-compact ${userData.weightGoalType === 'gain' ? 'active' : ''}`}
                        onClick={() => handleSelectionToggle('weightGoalType', 'gain')}
                      >
                        набрать
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Временные рамки */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  Временные рамки
                </label>
                <div className="form-row-four">
                  <div className="form-field-compact">
                    <input
                      type="number"
                      value={userData.timeGoal}
                      onChange={(e) => handleInputChange('timeGoal', parseInt(e.target.value) || 0)}
                      className="form-input-compact"
                      placeholder="Время"
                      min="1"
                    />
                  </div>
                  <div className="form-field-compact">
                    <div className="button-group-compact">
                      <button
                        className={`selection-btn-compact ${userData.timeGoalUnit === 'weeks' ? 'active' : ''}`}
                        onClick={() => handleSelectionToggle('timeGoalUnit', 'weeks')}
                      >
                        недель
                      </button>
                      <button
                        className={`selection-btn-compact ${userData.timeGoalUnit === 'months' ? 'active' : ''}`}
                        onClick={() => handleSelectionToggle('timeGoalUnit', 'months')}
                      >
                        месяцев
                      </button>
                    </div>
                  </div>
                </div>
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
                {['гантели', 'резинки', 'беговая дорожка', 'тренажеры в зале', 'ничего', 'нет'].map(item => (
                  <button
                    key={item}
                    className={`selection-btn ${userData.equipment.includes(item) ? 'active' : ''}`}
                    onClick={() => handleArrayToggle('equipment', item)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  className={`selection-btn ${userData.equipment.includes('другое') ? 'active' : ''}`}
                  onClick={() => handleArrayOtherToggle('equipment', 'equipmentOther')}
                >
                  другое
                </button>
              </div>
              {userData.equipment.includes('другое') && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={userData.equipmentOther}
                    onChange={(e) => handleArrayOtherInput('equipment', 'equipmentOther', e.target.value)}
                    className="form-input-compact"
                    placeholder="Укажите ваш инвентарь"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
            </div>

            {/* Бюджет на докупку инвентаря */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', marginBottom: '8px', display: 'block' }}>
                Бюджет на докупку инвентаря
              </label>
              <div className="button-group">
                <button
                  className={`selection-btn ${userData.budget === 'yes' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('budget', 'yes')}
                >
                  да
                </button>
                <button
                  className={`selection-btn ${userData.budget === 'no' ? 'active' : ''}`}
                  onClick={() => handleSelectionToggle('budget', 'no')}
                >
                  нет
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
                {['бросал', 'не хватало времени', 'нет мотивации', 'не было необходимости', 'другое'].map(item => (
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

        </div>

        {/* Форма промежуточных замеров */}
        {showIntermediateForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1F2937',
                  margin: 0
                }}>
                  {editingResultId ? 'Редактирование результата' : 'Промежуточные замеры'}
                </h2>
                <button
                  onClick={() => {
                    setShowIntermediateForm(false);
                    setEditingResultId(null);
                    setIntermediateFormData({
                      weight: '',
                      waist: '',
                      chest: '',
                      hips: '',
                      biceps: '',
                      thigh: '',
                      bodyFat: '',
                      squats: '',
                      pullUps: '',
                      running: '',
                      pulse: '',
                      photoFile: null,
                      photoFileName: ''
                    });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Стартовые замеры
                </label>
                
                {/* Вес */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Вес</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.weight}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, weight: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="Кг"
                    />
                  </div>
                </div>
                
                {/* Талия */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Талия</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.waist}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, waist: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="См"
                    />
                  </div>
                </div>
                
                {/* Грудь */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Грудь</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.chest}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, chest: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="См"
                    />
                  </div>
                </div>
                
                {/* Бёдра */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Бёдра</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.hips}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, hips: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="См"
                    />
                  </div>
                </div>
                
                {/* Бицепс */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Бицепс</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.biceps}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, biceps: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="См"
                    />
                  </div>
                </div>
                
                {/* Бедро */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Бедро</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.thigh}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, thigh: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="См"
                    />
                  </div>
                </div>
                
                {/* Процент жира */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>% жира</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.bodyFat}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, bodyFat: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="%"
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Спортивные тесты
                </label>
                
                {/* Приседания */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Приседания</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.squats}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, squats: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="Кол-во"
                    />
                  </div>
                </div>
                
                {/* Подтягивания */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Подтягивания</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.pullUps}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, pullUps: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="Кол-во"
                    />
                  </div>
                </div>
                
                {/* Бег */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Бег</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.running}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, running: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="Км"
                    />
                  </div>
                </div>
                
                {/* Пульс */}
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', color: '#6B7280' }}>Пульс</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={intermediateFormData.pulse}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setIntermediateFormData(prev => ({ ...prev, pulse: value }));
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#1F2937',
                        textAlign: 'right',
                        width: '50px'
                      }}
                      placeholder="Уд/мин"
                    />
                  </div>
                </div>
              </div>

              {/* Фото промежуточного результата */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'block' }}>
                  Фото промежуточного результата
                </label>
                
                <div style={{ 
                  background: '#F9FAFB', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: '1px solid #E5E7EB'
                }}>
                  {intermediateFormData.photoFile ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <span style={{ fontSize: '14px', color: '#1F2937' }}>
                        {intermediateFormData.photoFileName || 'Фото'}
                      </span>
                                                 <button
                           onClick={() => {
                             if (intermediateFormData.photoFile) {
                               fileToBase64(intermediateFormData.photoFile).then(base64 => {
                                 setViewingPhoto({ data: base64, name: intermediateFormData.photoFileName });
                               });
                             }
                           }}
                          style={{
                            background: '#1E40AF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Просмотреть
                        </button>
                      </div>
                                             <button
                         onClick={() => setIntermediateFormData(prev => ({ ...prev, photoFile: null, photoFileName: '' }))}
                        style={{
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1V11M8 11L4 7M8 11L12 7M2 15H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Загрузить фото
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIntermediateFormData(prev => ({ 
                              ...prev, 
                              photoFile: file,
                              photoFileName: file.name
                            }));
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setShowIntermediateForm(false);
                    setEditingResultId(null);
                    setIntermediateFormData({
                      weight: '',
                      waist: '',
                      chest: '',
                      hips: '',
                      biceps: '',
                      thigh: '',
                      bodyFat: '',
                      squats: '',
                      pullUps: '',
                      running: '',
                      pulse: '',
                      photoFile: null,
                      photoFileName: ''
                    });
                  }}
                  style={{
                    background: '#E5E7EB',
                    color: '#6B7280',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    // Сначала конвертируем фото в base64, если оно есть
                    if (intermediateFormData.photoFile) {
                      fileToBase64(intermediateFormData.photoFile).then(base64 => {
                        const resultData = {
                          weight: intermediateFormData.weight ? parseFloat(intermediateFormData.weight) : undefined,
                          waist: intermediateFormData.waist ? parseFloat(intermediateFormData.waist) : undefined,
                          chest: intermediateFormData.chest ? parseFloat(intermediateFormData.chest) : undefined,
                          hips: intermediateFormData.hips ? parseFloat(intermediateFormData.hips) : undefined,
                          biceps: intermediateFormData.biceps ? parseFloat(intermediateFormData.biceps) : undefined,
                          thigh: intermediateFormData.thigh ? parseFloat(intermediateFormData.thigh) : undefined,
                          bodyFat: intermediateFormData.bodyFat ? parseFloat(intermediateFormData.bodyFat) : undefined,
                          squats: intermediateFormData.squats ? parseInt(intermediateFormData.squats) : undefined,
                          pullUps: intermediateFormData.pullUps ? parseInt(intermediateFormData.pullUps) : undefined,
                          running: intermediateFormData.running ? parseFloat(intermediateFormData.running) : undefined,
                          pulse: intermediateFormData.pulse ? parseInt(intermediateFormData.pulse) : undefined,
                          photoFile: base64
                        };

                        saveResult(resultData);
                      }).catch(error => {
                        console.error('Ошибка при конвертации фото:', error);
                        // Сохраняем без фото в случае ошибки
                        const resultData = {
                          weight: intermediateFormData.weight ? parseFloat(intermediateFormData.weight) : undefined,
                          waist: intermediateFormData.waist ? parseFloat(intermediateFormData.waist) : undefined,
                          chest: intermediateFormData.chest ? parseFloat(intermediateFormData.chest) : undefined,
                          hips: intermediateFormData.hips ? parseFloat(intermediateFormData.hips) : undefined,
                          biceps: intermediateFormData.biceps ? parseFloat(intermediateFormData.biceps) : undefined,
                          thigh: intermediateFormData.thigh ? parseFloat(intermediateFormData.thigh) : undefined,
                          bodyFat: intermediateFormData.bodyFat ? parseFloat(intermediateFormData.bodyFat) : undefined,
                          squats: intermediateFormData.squats ? parseInt(intermediateFormData.squats) : undefined,
                          pullUps: intermediateFormData.pullUps ? parseInt(intermediateFormData.pullUps) : undefined,
                          running: intermediateFormData.running ? parseFloat(intermediateFormData.running) : undefined,
                          pulse: intermediateFormData.pulse ? parseInt(intermediateFormData.pulse) : undefined,
                          photoFile: undefined
                        };

                        saveResult(resultData);
                      });
                    } else {
                      // Если фото нет, сохраняем сразу
                      const resultData = {
                        weight: intermediateFormData.weight ? parseFloat(intermediateFormData.weight) : undefined,
                        waist: intermediateFormData.waist ? parseFloat(intermediateFormData.waist) : undefined,
                        chest: intermediateFormData.chest ? parseFloat(intermediateFormData.chest) : undefined,
                        hips: intermediateFormData.hips ? parseFloat(intermediateFormData.hips) : undefined,
                        biceps: intermediateFormData.biceps ? parseFloat(intermediateFormData.biceps) : undefined,
                        thigh: intermediateFormData.thigh ? parseFloat(intermediateFormData.thigh) : undefined,
                        bodyFat: intermediateFormData.bodyFat ? parseFloat(intermediateFormData.bodyFat) : undefined,
                        squats: intermediateFormData.squats ? parseInt(intermediateFormData.squats) : undefined,
                        pullUps: intermediateFormData.pullUps ? parseInt(intermediateFormData.pullUps) : undefined,
                        running: intermediateFormData.running ? parseFloat(intermediateFormData.running) : undefined,
                        pulse: intermediateFormData.pulse ? parseInt(intermediateFormData.pulse) : undefined,
                        photoFile: undefined
                      };

                      saveResult(resultData);
                    }
                  }}
                  style={{
                    background: '#1E40AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно для просмотра фото */}
        {viewingPhoto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  {viewingPhoto.name}
                </h3>
                <button
                  onClick={() => setViewingPhoto(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <img
                  src={viewingPhoto.data}
                  alt={viewingPhoto.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Информационное сообщение */}
        <div style={{
          background: '#F3F4F6',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            Все данные сохраняются автоматически. Скачай данные и отправь наставнику
          </p>
        </div>

        {/* Кнопка "Вернуться в "Мое расписание"" */}
        <div className="profile-actions">
          <button className="next-btn" onClick={handleNext}>
            Вернуться в "Мое расписание"
          </button>
        </div>
      </main>
    </div>
  );
};
