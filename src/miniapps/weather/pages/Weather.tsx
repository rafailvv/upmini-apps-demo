import React, { useState } from 'react';
import '../styles.css';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const Weather: React.FC = () => {
  const [currentCity, setCurrentCity] = useState('Москва');
  const [weatherData, setWeatherData] = useState<WeatherData>({
    city: 'Москва',
    temperature: 18,
    description: 'Облачно',
    humidity: 65,
    windSpeed: 12,
    icon: '☁️',
  });

  const cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'];

  const mockWeatherData: Record<string, WeatherData> = {
    'Москва': {
      city: 'Москва',
      temperature: 18,
      description: 'Облачно',
      humidity: 65,
      windSpeed: 12,
      icon: '☁️',
    },
    'Санкт-Петербург': {
      city: 'Санкт-Петербург',
      temperature: 15,
      description: 'Дождь',
      humidity: 80,
      windSpeed: 18,
      icon: '🌧️',
    },
    'Новосибирск': {
      city: 'Новосибирск',
      temperature: 22,
      description: 'Солнечно',
      humidity: 45,
      windSpeed: 8,
      icon: '☀️',
    },
    'Екатеринбург': {
      city: 'Екатеринбург',
      temperature: 16,
      description: 'Переменная облачность',
      humidity: 60,
      windSpeed: 10,
      icon: '⛅',
    },
    'Казань': {
      city: 'Казань',
      temperature: 20,
      description: 'Ясно',
      humidity: 55,
      windSpeed: 6,
      icon: '🌤️',
    },
  };

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
    setWeatherData(mockWeatherData[city]);
  };

  return (
    <div className="weather-app">
      <div className="weather-header">
        <h2>Погода</h2>
        <div className="city-selector">
          <select
            value={currentCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="city-select"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="weather-main">
        <div className="weather-icon">
          <span className="weather-emoji">{weatherData.icon}</span>
        </div>
        
        <div className="weather-info">
          <div className="temperature">
            {weatherData.temperature}°C
          </div>
          <div className="description">
            {weatherData.description}
          </div>
          <div className="city-name">
            {weatherData.city}
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <span className="detail-label">Влажность</span>
            <span className="detail-value">{weatherData.humidity}%</span>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-info">
            <span className="detail-label">Ветер</span>
            <span className="detail-value">{weatherData.windSpeed} км/ч</span>
          </div>
        </div>
      </div>

      <div className="weather-forecast">
        <h3>Прогноз на 5 дней</h3>
        <div className="forecast-list">
          {[1, 2, 3, 4, 5].map((day) => (
            <div key={day} className="forecast-item">
              <div className="forecast-day">
                {day === 1 ? 'Завтра' : `+${day} дн`}
              </div>
              <div className="forecast-icon">
                {day % 2 === 0 ? '☀️' : '🌤️'}
              </div>
              <div className="forecast-temp">
                {weatherData.temperature + day * 2}°C
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 