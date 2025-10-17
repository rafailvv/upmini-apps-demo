import React from 'react';
import '../styles.css';

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  correctAnswers: number[];
  wrongAnswers: number[];
}

interface QuizResultScreenProps {
  result: QuizResult;
  onReview: () => void;
  onShare: () => void;
}

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  result,
  onReview,
  onShare
}) => {
  const getResultMessage = () => {
    if (result.percentage >= 80) {
      return {
        title: "Отлично! 🎉",
        message: "Вы уверенно знаете тему! Отличная работа!",
        color: "#28a745"
      };
    } else if (result.percentage >= 60) {
      return {
        title: "Хорошо! 👍",
        message: "Неплохой результат! Есть что улучшить.",
        color: "#ffc107"
      };
    } else {
      return {
        title: "Продолжайте! 💪",
        message: "Стоит повторить материал. Каждый шаг важен!",
        color: "#17a2b8"
      };
    }
  };

  const resultInfo = getResultMessage();

  return (
    <div className="quiz-result-container">
      <div className="quiz-result-content">
        {/* Header */}
        <div className="quiz-result-header">
          <h1 className="quiz-result-title">Ваш результат</h1>
        </div>

        {/* Score Card */}
        <div className="quiz-result-score-card">
          <div className="quiz-result-score-circle">
            <div className="quiz-result-score-number">{result.score}</div>
            <div className="quiz-result-score-total">из {result.total}</div>
          </div>
          <div className="quiz-result-percentage">{result.percentage}%</div>
        </div>

        {/* Result Message */}
        <div className="quiz-result-message">
          <h2 className="quiz-result-message-title">
            {resultInfo.title}
          </h2>
          <p className="quiz-result-message-text">{resultInfo.message}</p>
        </div>

        {/* Action Buttons */}
        <div className="quiz-result-actions">
          <button 
            className="quiz-result-button quiz-result-button-primary"
            onClick={onReview}
          >
            <span className="quiz-result-button-icon">📖</span>
            Посмотреть разбор
          </button>
          
          <button 
            className="quiz-result-button quiz-result-button-tertiary"
            onClick={onShare}
          >
            <span className="quiz-result-button-icon">📤</span>
            Поделиться результатом
          </button>
        </div>

        {/* Progress Bar */}
        <div className="quiz-result-progress">
          <div className="quiz-result-progress-bar">
            <div 
              className="quiz-result-progress-fill"
              style={{ 
                width: `${result.percentage}%`,
                backgroundColor: resultInfo.color
              }}
            />
          </div>
          <div className="quiz-result-progress-text">
            Правильных ответов: {result.score} из {result.total}
          </div>
        </div>
      </div>
    </div>
  );
};
