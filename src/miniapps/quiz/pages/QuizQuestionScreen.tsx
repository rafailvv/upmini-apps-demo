import React, { useState, useEffect } from 'react';
import '../styles.css';
import type { QuizQuestion } from '../QuizApp';

interface QuizQuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  onSkip: () => void;
  timeLeft?: number;
}

export const QuizQuestionScreen: React.FC<QuizQuestionScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onSkip,
  timeLeft
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setShowHint(false);
  }, [question.id]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return; // Prevent selection after result is shown
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  const handleHintToggle = () => {
    setShowHint(!showHint);
  };

  const getAnswerButtonClass = (index: number) => {
    if (!showResult) return 'quiz-answer-button';
    
    if (index === question.correctAnswer) {
      return 'quiz-answer-button correct';
    } else if (index === selectedAnswer && index !== question.correctAnswer) {
      return 'quiz-answer-button incorrect';
    } else {
      return 'quiz-answer-button disabled';
    }
  };

  return (
    <div className="quiz-question-container">
      {/* Header with progress and timer */}
      <div className="quiz-question-header">
        <div className="quiz-question-progress">
          <span className="quiz-question-counter">
            Вопрос {questionNumber} из {totalQuestions}
          </span>
          <div className="quiz-question-progress-bar">
            <div 
              className="quiz-question-progress-fill"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        {timeLeft !== undefined && (
          <div className="quiz-question-timer">
            <span className="quiz-timer-icon">⏱️</span>
            <span className="quiz-timer-text">{timeLeft}с</span>
          </div>
        )}
      </div>

      {/* Question content */}
      <div className="quiz-question-content">
        {/* Question card */}
        <div className={`quiz-question-card ${showHint ? 'with-hint' : ''}`}>
          <div className={`quiz-card-inner ${showResult ? 'flipped' : ''}`}>
            {/* Front side - Question */}
            <div className="quiz-card-front">
              <div className="quiz-question-header-card">
                <h2 className="quiz-question-text">{question.question}</h2>
                <button 
                  className="quiz-hint-button"
                  onClick={handleHintToggle}
                  title="Подсказка"
                >
                  <span className="quiz-hint-icon">i</span>
                </button>
              </div>
              
              {/* Hint section */}
              {showHint && (
                <div className="quiz-hint-section">
                  <div className="quiz-hint-content">
                    <span className="quiz-hint-label">💡 Подсказка:</span>
                    <p className="quiz-hint-text">
                      {question.hint || "Подумайте внимательно над каждым вариантом ответа. Обратите внимание на детали в вопросе."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Answer options */}
              <div className="quiz-answer-options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={getAnswerButtonClass(index)}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <span className="quiz-answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="quiz-answer-text">{option}</span>
                  </button>
                ))}
              </div>

              {/* Skip button */}
              {!showResult && (
                <button 
                  className="quiz-skip-button"
                  onClick={onSkip}
                >
                  Пропустить
                </button>
              )}
            </div>

            {/* Back side - Result and explanation */}
            <div className="quiz-card-back">
              <div className="quiz-result-feedback">
                {selectedAnswer === question.correctAnswer ? (
                  <div className="quiz-result-correct">
                    <span className="quiz-result-icon">✅</span>
                    <span className="quiz-result-text">Правильно!</span>
                  </div>
                ) : (
                  <div className="quiz-result-incorrect">
                    <span className="quiz-result-icon">❌</span>
                    <span className="quiz-result-text">Неправильно</span>
                  </div>
                )}
              </div>

              {showExplanation && question.explanation && (
                <div className="quiz-explanation">
                  <h3 className="quiz-explanation-title">Пояснение:</h3>
                  <p className="quiz-explanation-text">{question.explanation}</p>
                </div>
              )}

              <button 
                className="quiz-next-button"
                onClick={handleNext}
              >
                {questionNumber === totalQuestions ? 'Завершить' : 'Следующий вопрос'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
