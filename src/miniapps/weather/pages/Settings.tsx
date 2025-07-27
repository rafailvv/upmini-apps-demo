import React, { useState } from 'react';
import '../styles.css';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    notifications: true,
    autoLocation: false,
    language: 'ru',
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="weather-settings">
      <h2>Настройки</h2>
      
      <div className="settings-section">
        <h3>Единицы измерения</h3>
        
        <div className="setting-item">
          <label>Температура</label>
          <div className="setting-control">
            <select
              value={settings.temperatureUnit}
              onChange={(e) => handleSettingChange('temperatureUnit', e.target.value)}
            >
              <option value="celsius">Цельсий (°C)</option>
              <option value="fahrenheit">Фаренгейт (°F)</option>
              <option value="kelvin">Кельвин (K)</option>
            </select>
          </div>
        </div>

        <div className="setting-item">
          <label>Скорость ветра</label>
          <div className="setting-control">
            <select
              value={settings.windSpeedUnit}
              onChange={(e) => handleSettingChange('windSpeedUnit', e.target.value)}
            >
              <option value="kmh">км/ч</option>
              <option value="mph">миль/ч</option>
              <option value="ms">м/с</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Уведомления</h3>
        
        <div className="setting-item">
          <label>Включить уведомления</label>
          <div className="setting-control">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
          </div>
        </div>

        <div className="setting-item">
          <label>Автоматическое определение местоположения</label>
          <div className="setting-control">
            <input
              type="checkbox"
              checked={settings.autoLocation}
              onChange={(e) => handleSettingChange('autoLocation', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Язык</h3>
        
        <div className="setting-item">
          <label>Язык интерфейса</label>
          <div className="setting-control">
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings-btn">
          Сохранить настройки
        </button>
        <button className="reset-settings-btn">
          Сбросить к значениям по умолчанию
        </button>
      </div>

      <div className="settings-info">
        <h3>О приложении</h3>
        <p>Версия: 1.0.0</p>
        <p>Разработчик: Demo Team</p>
        <p>Данные о погоде предоставляются демонстрационными целями</p>
      </div>
    </div>
  );
}; 