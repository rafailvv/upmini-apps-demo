import React from 'react';
import '../styles.css';

interface QuizIntroScreenProps {
  onProceed: () => void;
  onBack: () => void;
}

export const QuizIntroScreen: React.FC<QuizIntroScreenProps> = ({ onProceed, onBack }) => {
  return (
    <div className="quiz-intro-container">
      {/* Header */}
      <div className="quiz-intro-header">
        <button className="quiz-intro-back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="quiz-intro-title">Как проходит тест</h1>
      </div>

      {/* Content */}
      <div className="quiz-intro-content">
        <div className="quiz-intro-steps">
          <div className="quiz-intro-step">
            <div className="quiz-intro-step-number">1</div>
            <div className="quiz-intro-step-text">
              <h3>Ответьте на несколько вопросов</h3>
              <p>Вам предстоит ответить на 5 вопросов по выбранной теме</p>
            </div>
          </div>

          <div className="quiz-intro-step">
            <div className="quiz-intro-step-number">2</div>
            <div className="quiz-intro-step-text">
              <h3>Получите пояснения</h3>
              <p>После каждого вопроса вы увидите объяснение правильного ответа</p>
            </div>
          </div>

          <div className="quiz-intro-step">
            <div className="quiz-intro-step-number">3</div>
            <div className="quiz-intro-step-text">
              <h3>Узнайте результат</h3>
              <p>В конце теста вы получите оценку и рекомендации для улучшения</p>
            </div>
          </div>

          <div className="quiz-intro-step">
            <div className="quiz-intro-step-number">4</div>
            <div className="quiz-intro-step-text">
              <h3>Изучайте в своем темпе</h3>
              <p>Не торопитесь — у вас есть время подумать над каждым ответом</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="quiz-intro-actions">
        <button className="quiz-intro-back-action" onClick={onBack}>
          Назад
        </button>
        <button className="quiz-intro-proceed-action" onClick={onProceed}>
          Продолжить
        </button>
      </div>
    </div>
  );
};
