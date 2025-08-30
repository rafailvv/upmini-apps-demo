import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Добавляем типы для компонента
interface HealthProps {}

interface HealthData {
  chronicDiseases: string[];
  injuries: string[];
  allergies: string[];
  medications: string[];
}

export const Health: React.FC<HealthProps> = () => {
  const navigate = useNavigate();
  
  // Добавляем отладочную информацию
  console.log('Health component rendered');
  
  const [healthData, setHealthData] = useState<HealthData>({
    chronicDiseases: [],
    injuries: [],
    allergies: [],
    medications: []
  });

  // Загружаем сохраненные данные при монтировании
  useEffect(() => {
    const savedHealthData = localStorage.getItem('healthData');
    if (savedHealthData) {
      setHealthData(JSON.parse(savedHealthData));
    }
  }, []);

  const handleInputChange = (field: keyof HealthData, value: any) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof HealthData, item: string) => {
    setHealthData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleBack = () => {
    navigate('/miniapp/sport-nutrition/profile');
  };

  const handleNext = () => {
    localStorage.setItem('healthData', JSON.stringify(healthData));
    // Здесь можно добавить навигацию к следующему шагу
    alert('Переход к следующему шагу!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#FFFFFF', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Заголовок */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <button 
          onClick={handleBack}
          style={{
            background: '#007AFF',
            border: 'none',
            padding: '12px 16px',
            cursor: 'pointer',
            color: '#FFFFFF',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Назад
        </button>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#000000', 
          margin: '0' 
        }}>
          Здоровье
        </h1>
      </div>

      {/* Форма */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Хронические заболевания */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <label style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Хронические заболевания
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {['нет', 'сердце', 'суставы', 'ЖКТ'].map(item => (
              <button
                key={item}
                onClick={() => handleArrayToggle('chronicDiseases', item)}
                style={{
                  padding: '8px 16px',
                  background: healthData.chronicDiseases.includes(item) ? '#007AFF' : '#F3F4F6',
                  border: '1px solid',
                  borderColor: healthData.chronicDiseases.includes(item) ? '#007AFF' : '#E5E7EB',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: healthData.chronicDiseases.includes(item) ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Травмы */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <label style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Травмы
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {['колени', 'спина', 'плечи', 'нет'].map(item => (
              <button
                key={item}
                onClick={() => handleArrayToggle('injuries', item)}
                style={{
                  padding: '8px 16px',
                  background: healthData.injuries.includes(item) ? '#007AFF' : '#F3F4F6',
                  border: '1px solid',
                  borderColor: healthData.injuries.includes(item) ? '#007AFF' : '#E5E7EB',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: healthData.injuries.includes(item) ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Аллергии и непереносимость */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <label style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Аллергии и непереносимость
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => handleArrayToggle('allergies', 'молочные продукты')}
              style={{
                padding: '8px 16px',
                background: healthData.allergies.includes('молочные продукты') ? '#007AFF' : '#F3F4F6',
                border: '1px solid',
                borderColor: healthData.allergies.includes('молочные продукты') ? '#007AFF' : '#E5E7EB',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                color: healthData.allergies.includes('молочные продукты') ? '#FFFFFF' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              молочные продукты
            </button>
          </div>
        </div>

        {/* Лекарства / добавки */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}>
          <label style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Лекарства / добавки
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {['витамин D', 'омега-3'].map(item => (
              <button
                key={item}
                onClick={() => handleArrayToggle('medications', item)}
                style={{
                  padding: '8px 16px',
                  background: healthData.medications.includes(item) ? '#007AFF' : '#F3F4F6',
                  border: '1px solid',
                  borderColor: healthData.medications.includes(item) ? '#007AFF' : '#E5E7EB',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: healthData.medications.includes(item) ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка Далее */}
      <div style={{ 
        marginTop: '40px', 
        paddingTop: '24px', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <button 
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#007AFF',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );
};


