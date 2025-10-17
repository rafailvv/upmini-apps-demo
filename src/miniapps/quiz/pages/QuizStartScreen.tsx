import React from 'react';
import '../styles.css';

interface QuizStartScreenProps {
  onStart: (topic: string) => void;
}

export const QuizStartScreen: React.FC<QuizStartScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    onStart('Общие знания');
  };

  return (
    <div className="quiz-responsive-container">
      {/* Main Title */}
      <h1 className="quiz-title-responsive">КВИЗ</h1>

      {/* Welcome Card */}
      <div className="quiz-welcome-card-responsive">
        <h2 className="quiz-welcome-title-responsive">Добро пожаловать на КВИЗ!</h2>
        <p className="quiz-welcome-description-responsive">
          Отвечай на вопросы по пройденной теме и получай баллы
        </p>
        <button 
          onClick={handleStart}
          className="quiz-start-button-responsive"
        >
          НАЧАТЬ
        </button>
      </div>
    </div>
  );
};
