import React, { useState, useEffect } from 'react';
import '../styles.css';

interface UserData {
  hasWeight: boolean;
  controlWeight: number;
  hasWaist: boolean;
  waist: number;
  hasHip: boolean;
  hip: number;
  hasChest: boolean;
  chest: number;
  hasNeck: boolean;
  neck: number;
  hasBicep: boolean;
  bicep: number;
  hasThigh: boolean;
  thigh: number;
  hasCalf: boolean;
  calf: number;
  hasBodyFat: boolean;
  bodyFat: number;
  hasMuscleMass: boolean;
  muscleMass: number;
  hasWaterPercentage: boolean;
  waterPercentage: number;
  hasBoneMass: boolean;
  boneMass: number;
  hasMetabolicAge: boolean;
  metabolicAge: number;
  hasVisceralFat: boolean;
  visceralFat: number;
  hasSquats: boolean;
  squats: number;
  hasPullUps: boolean;
  pullUps: number;
  hasRunning: boolean;
  running: number;
  hasPulse: boolean;
  pulse: number;
}

export const MetricsControl: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    hasWeight: false,
    controlWeight: 0,
    hasWaist: false,
    waist: 0,
    hasHip: false,
    hip: 0,
    hasChest: false,
    chest: 0,
    hasNeck: false,
    neck: 0,
    hasBicep: false,
    bicep: 0,
    hasThigh: false,
    thigh: 0,
    hasCalf: false,
    calf: 0,
    hasBodyFat: false,
    bodyFat: 0,
    hasMuscleMass: false,
    muscleMass: 0,
    hasWaterPercentage: false,
    waterPercentage: 0,
    hasBoneMass: false,
    boneMass: 0,
    hasMetabolicAge: false,
    metabolicAge: 0,
    hasVisceralFat: false,
    visceralFat: 0,
    hasSquats: false,
    squats: 0,
    hasPullUps: false,
    pullUps: 0,
    hasRunning: false,
    running: 0,
    hasPulse: false,
    pulse: 0,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(prevData => ({ ...prevData, ...parsedData }));
    }
  }, []);

  const handleInputChange = (field: keyof UserData, value: any) => {
    const newData = { ...userData, [field]: value };
    setUserData(newData);
    localStorage.setItem('userData', JSON.stringify(newData));
  };


  return (
    <div className="metrics-container">
      {/* Заголовок */}
      <div className="metrics-header">
        <h1>Метрики контроля</h1>
      </div>

      {/* Основной контент */}
      <div className="metrics-content">
        {/* Стартовые замеры */}
        <div className="metrics-section">
          <h2>Стартовые замеры</h2>
          
          {/* Вес */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasWeight ? 'disabled' : ''}`}>вес</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.controlWeight}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('controlWeight', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasWeight ? 'disabled' : ''}`}
                disabled={!userData.hasWeight}
              />
              <span className={`metric-unit ${!userData.hasWeight ? 'disabled' : ''}`}>кг</span>
              <button
                onClick={() => handleInputChange('hasWeight', !userData.hasWeight)}
                className={`toggle-btn ${userData.hasWeight ? 'active' : ''}`}
              >
                {userData.hasWeight ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Талия */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasWaist ? 'disabled' : ''}`}>талия</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.waist}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('waist', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasWaist ? 'disabled' : ''}`}
                disabled={!userData.hasWaist}
              />
              <span className={`metric-unit ${!userData.hasWaist ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasWaist', !userData.hasWaist)}
                className={`toggle-btn ${userData.hasWaist ? 'active' : ''}`}
              >
                {userData.hasWaist ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Бедра */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasHip ? 'disabled' : ''}`}>бедра</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.hip}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('hip', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasHip ? 'disabled' : ''}`}
                disabled={!userData.hasHip}
              />
              <span className={`metric-unit ${!userData.hasHip ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasHip', !userData.hasHip)}
                className={`toggle-btn ${userData.hasHip ? 'active' : ''}`}
              >
                {userData.hasHip ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Грудь */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasChest ? 'disabled' : ''}`}>грудь</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.chest}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('chest', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasChest ? 'disabled' : ''}`}
                disabled={!userData.hasChest}
              />
              <span className={`metric-unit ${!userData.hasChest ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasChest', !userData.hasChest)}
                className={`toggle-btn ${userData.hasChest ? 'active' : ''}`}
              >
                {userData.hasChest ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Шея */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasNeck ? 'disabled' : ''}`}>шея</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.neck}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('neck', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasNeck ? 'disabled' : ''}`}
                disabled={!userData.hasNeck}
              />
              <span className={`metric-unit ${!userData.hasNeck ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasNeck', !userData.hasNeck)}
                className={`toggle-btn ${userData.hasNeck ? 'active' : ''}`}
              >
                {userData.hasNeck ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Бицепс */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasBicep ? 'disabled' : ''}`}>бицепс</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.bicep}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('bicep', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasBicep ? 'disabled' : ''}`}
                disabled={!userData.hasBicep}
              />
              <span className={`metric-unit ${!userData.hasBicep ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasBicep', !userData.hasBicep)}
                className={`toggle-btn ${userData.hasBicep ? 'active' : ''}`}
              >
                {userData.hasBicep ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Бедро */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasThigh ? 'disabled' : ''}`}>бедро</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.thigh}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('thigh', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasThigh ? 'disabled' : ''}`}
                disabled={!userData.hasThigh}
              />
              <span className={`metric-unit ${!userData.hasThigh ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasThigh', !userData.hasThigh)}
                className={`toggle-btn ${userData.hasThigh ? 'active' : ''}`}
              >
                {userData.hasThigh ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Икра */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasCalf ? 'disabled' : ''}`}>икра</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.calf}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('calf', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasCalf ? 'disabled' : ''}`}
                disabled={!userData.hasCalf}
              />
              <span className={`metric-unit ${!userData.hasCalf ? 'disabled' : ''}`}>см</span>
              <button
                onClick={() => handleInputChange('hasCalf', !userData.hasCalf)}
                className={`toggle-btn ${userData.hasCalf ? 'active' : ''}`}
              >
                {userData.hasCalf ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>
        </div>

        {/* Состав тела */}
        <div className="metrics-section">
          <h2>Состав тела</h2>
          
          {/* Процент жира */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasBodyFat ? 'disabled' : ''}`}>процент жира</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.bodyFat}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('bodyFat', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasBodyFat ? 'disabled' : ''}`}
                disabled={!userData.hasBodyFat}
              />
              <span className={`metric-unit ${!userData.hasBodyFat ? 'disabled' : ''}`}>%</span>
              <button
                onClick={() => handleInputChange('hasBodyFat', !userData.hasBodyFat)}
                className={`toggle-btn ${userData.hasBodyFat ? 'active' : ''}`}
              >
                {userData.hasBodyFat ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Мышечная масса */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasMuscleMass ? 'disabled' : ''}`}>мышечная масса</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.muscleMass}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('muscleMass', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasMuscleMass ? 'disabled' : ''}`}
                disabled={!userData.hasMuscleMass}
              />
              <span className={`metric-unit ${!userData.hasMuscleMass ? 'disabled' : ''}`}>кг</span>
              <button
                onClick={() => handleInputChange('hasMuscleMass', !userData.hasMuscleMass)}
                className={`toggle-btn ${userData.hasMuscleMass ? 'active' : ''}`}
              >
                {userData.hasMuscleMass ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Процент воды */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasWaterPercentage ? 'disabled' : ''}`}>процент воды</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.waterPercentage}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('waterPercentage', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasWaterPercentage ? 'disabled' : ''}`}
                disabled={!userData.hasWaterPercentage}
              />
              <span className={`metric-unit ${!userData.hasWaterPercentage ? 'disabled' : ''}`}>%</span>
              <button
                onClick={() => handleInputChange('hasWaterPercentage', !userData.hasWaterPercentage)}
                className={`toggle-btn ${userData.hasWaterPercentage ? 'active' : ''}`}
              >
                {userData.hasWaterPercentage ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Костная масса */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasBoneMass ? 'disabled' : ''}`}>костная масса</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.boneMass}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('boneMass', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasBoneMass ? 'disabled' : ''}`}
                disabled={!userData.hasBoneMass}
              />
              <span className={`metric-unit ${!userData.hasBoneMass ? 'disabled' : ''}`}>кг</span>
              <button
                onClick={() => handleInputChange('hasBoneMass', !userData.hasBoneMass)}
                className={`toggle-btn ${userData.hasBoneMass ? 'active' : ''}`}
              >
                {userData.hasBoneMass ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Метаболический возраст */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasMetabolicAge ? 'disabled' : ''}`}>метаболический возраст</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.metabolicAge}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('metabolicAge', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasMetabolicAge ? 'disabled' : ''}`}
                disabled={!userData.hasMetabolicAge}
              />
              <span className={`metric-unit ${!userData.hasMetabolicAge ? 'disabled' : ''}`}>лет</span>
              <button
                onClick={() => handleInputChange('hasMetabolicAge', !userData.hasMetabolicAge)}
                className={`toggle-btn ${userData.hasMetabolicAge ? 'active' : ''}`}
              >
                {userData.hasMetabolicAge ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Висцеральный жир */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasVisceralFat ? 'disabled' : ''}`}>висцеральный жир</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.visceralFat}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('visceralFat', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasVisceralFat ? 'disabled' : ''}`}
                disabled={!userData.hasVisceralFat}
              />
              <span className={`metric-unit ${!userData.hasVisceralFat ? 'disabled' : ''}`}>%</span>
              <button
                onClick={() => handleInputChange('hasVisceralFat', !userData.hasVisceralFat)}
                className={`toggle-btn ${userData.hasVisceralFat ? 'active' : ''}`}
              >
                {userData.hasVisceralFat ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>
        </div>

        {/* Спортивные тесты */}
        <div className="metrics-section">
          <h2>Спортивные тесты</h2>
          
          {/* Приседания */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasSquats ? 'disabled' : ''}`}>приседания</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.squats}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('squats', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasSquats ? 'disabled' : ''}`}
                disabled={!userData.hasSquats}
              />
              <span className={`metric-unit ${!userData.hasSquats ? 'disabled' : ''}`}>раз</span>
              <button
                onClick={() => handleInputChange('hasSquats', !userData.hasSquats)}
                className={`toggle-btn ${userData.hasSquats ? 'active' : ''}`}
              >
                {userData.hasSquats ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Подтягивания */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasPullUps ? 'disabled' : ''}`}>подтягивания</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.pullUps}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('pullUps', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasPullUps ? 'disabled' : ''}`}
                disabled={!userData.hasPullUps}
              />
              <span className={`metric-unit ${!userData.hasPullUps ? 'disabled' : ''}`}>раз</span>
              <button
                onClick={() => handleInputChange('hasPullUps', !userData.hasPullUps)}
                className={`toggle-btn ${userData.hasPullUps ? 'active' : ''}`}
              >
                {userData.hasPullUps ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Бег */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasRunning ? 'disabled' : ''}`}>бег</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.running}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  handleInputChange('running', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasRunning ? 'disabled' : ''}`}
                disabled={!userData.hasRunning}
              />
              <span className={`metric-unit ${!userData.hasRunning ? 'disabled' : ''}`}>км</span>
              <button
                onClick={() => handleInputChange('hasRunning', !userData.hasRunning)}
                className={`toggle-btn ${userData.hasRunning ? 'active' : ''}`}
              >
                {userData.hasRunning ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>

          {/* Пульс */}
          <div className="metric-item">
            <span className={`metric-label ${!userData.hasPulse ? 'disabled' : ''}`}>пульс</span>
            <div className="metric-input-group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={userData.pulse}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('pulse', parseInt(value) || 0);
                }}
                className={`metric-input ${!userData.hasPulse ? 'disabled' : ''}`}
                disabled={!userData.hasPulse}
              />
              <span className={`metric-unit ${!userData.hasPulse ? 'disabled' : ''}`}>уд/мин</span>
              <button
                onClick={() => handleInputChange('hasPulse', !userData.hasPulse)}
                className={`toggle-btn ${userData.hasPulse ? 'active' : ''}`}
              >
                {userData.hasPulse ? 'нет замера' : 'есть замер'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
