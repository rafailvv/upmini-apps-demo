import React, { useState, useEffect } from 'react';
import '../styles.css';
import type { QuizQuestion } from '../QuizApp';

interface QuizQuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: number | number[] | string) => void;
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
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setOpenAnswer('');
    setShowResult(false);
    setShowExplanation(false);
    setShowHint(false);
    setAnswerSubmitted(false);
  }, [question.id]);


  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || answerSubmitted) return; // Prevent selection after result is shown or answer submitted
    
    if (question.type === 'single' || !question.type) {
      setSelectedAnswer(answerIndex);
      setShowResult(true);
      setShowExplanation(true);
      setAnswerSubmitted(true);
      // No automatic flip - card stays flipped until user clicks "Далее"
    } else if (question.type === 'multiple') {
      const newSelected = selectedAnswers.includes(answerIndex)
        ? selectedAnswers.filter(i => i !== answerIndex)
        : [...selectedAnswers, answerIndex];
      setSelectedAnswers(newSelected);
    }
  };

  const handleMultipleSubmit = () => {
    if (selectedAnswers.length === 0 || answerSubmitted) return;
    setShowResult(true);
    setShowExplanation(true);
    setAnswerSubmitted(true);
    // No automatic flip - card stays flipped until user clicks "Далее"
  };

  const handleOpenSubmit = () => {
    if (openAnswer.trim() && !answerSubmitted) {
      setShowResult(true);
      setShowExplanation(true);
      setAnswerSubmitted(true);
      // No automatic flip - card stays flipped until user clicks "Далее"
    }
  };

  const handleNext = () => {
    // Allow manual navigation even if answer was already submitted
    if (question.type === 'single' || !question.type) {
      if (selectedAnswer !== null) {
        onAnswer(selectedAnswer);
      }
    } else if (question.type === 'multiple') {
      if (selectedAnswers.length > 0) {
        onAnswer(selectedAnswers);
      }
    } else if (question.type === 'open') {
      if (openAnswer.trim()) {
        onAnswer(openAnswer.trim());
      }
    }
  };

  const handleHintToggle = () => {
    setShowHint(!showHint);
  };


  const getAnswerButtonClass = (index: number) => {
    if (!showResult) {
      if (question.type === 'multiple') {
        return selectedAnswers.includes(index) 
          ? 'quiz-answer-button quiz-answer-button-selected' 
          : 'quiz-answer-button';
      }
      return 'quiz-answer-button';
    }
    
    if (question.type === 'single' || !question.type) {
      if (index === question.correctAnswer) {
        return 'quiz-answer-button correct';
      } else if (index === selectedAnswer && index !== question.correctAnswer) {
        return 'quiz-answer-button incorrect';
      } else {
        return 'quiz-answer-button disabled';
      }
    } else if (question.type === 'multiple') {
      const correctAnswers = question.correctAnswer as number[];
      const isCorrect = correctAnswers.includes(index);
      const isSelected = selectedAnswers.includes(index);
      
      if (isCorrect && isSelected) {
        return 'quiz-answer-button correct';
      } else if (isCorrect && !isSelected) {
        return 'quiz-answer-button correct-missed';
      } else if (!isCorrect && isSelected) {
        return 'quiz-answer-button incorrect';
      } else {
        return 'quiz-answer-button disabled';
      }
    }
    
    return 'quiz-answer-button disabled';
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
        {/* Question type indicator - outside card */}
        <div className="quiz-question-type-indicator">
          {question.type === 'multiple' ? 'Выбери несколько правильных ответов' : 
           question.type === 'open' ? 'Введи ответ в текстовое поле' : 
           'Выбери один правильный ответ'}
        </div>
        
        {/* Question card */}
        <div className={`quiz-question-card dynamic-height ${showHint ? 'with-hint' : ''}`}>
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
              {question.type === 'open' ? (
                <div className="quiz-open-answer">
                  <textarea
                    className="quiz-open-input"
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    placeholder="Введите ваш ответ..."
                    disabled={showResult}
                    rows={3}
                  />
                </div>
              ) : (
                <div className="quiz-answer-options">
                  {question.options?.map((option, index) => (
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
              )}

              {/* Action buttons container */}
              {!showResult && (
                <div className="quiz-action-buttons">
                  <button 
                    className="quiz-skip-button"
                    onClick={onSkip}
                  >
                    Пропустить
                  </button>
                  
                  {question.type === 'multiple' && selectedAnswers.length > 0 && (
                    <button
                      className="quiz-submit-button"
                      onClick={handleMultipleSubmit}
                    >
                      Далее
                    </button>
                  )}
                  
                  {question.type === 'open' && openAnswer.trim() && (
                    <button
                      className="quiz-submit-button"
                      onClick={handleOpenSubmit}
                    >
                      Далее
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Back side - Result and explanation */}
            <div className="quiz-card-back">
              {showExplanation && (
                <div className="quiz-result-feedback">
                  {question.type === 'single' || !question.type ? (
                    selectedAnswer === question.correctAnswer ? (
                      <div className="quiz-result-correct">
                        <span className="quiz-result-icon">✅</span>
                        <span className="quiz-result-text">Правильно!</span>
                      </div>
                    ) : (
                      <div className="quiz-result-incorrect">
                        <span className="quiz-result-icon">❌</span>
                        <span className="quiz-result-text">Неправильно</span>
                      </div>
                    )
                  ) : question.type === 'multiple' ? (
                    (() => {
                      const correct = question.correctAnswer as number[];
                      const isCorrect = correct.every(ans => selectedAnswers.includes(ans)) && 
                                       selectedAnswers.every(ans => correct.includes(ans));
                      return isCorrect ? (
                        <div className="quiz-result-correct">
                          <span className="quiz-result-icon">✅</span>
                          <span className="quiz-result-text">Правильно!</span>
                        </div>
                      ) : (
                        <div className="quiz-result-incorrect">
                          <span className="quiz-result-icon">❌</span>
                          <span className="quiz-result-text">Неправильно</span>
                        </div>
                      );
                    })()
                  ) : question.type === 'open' ? (
                    (() => {
                      const isCorrect = openAnswer.toLowerCase().trim() === (question.correctText as string).toLowerCase().trim();
                      return isCorrect ? (
                        <div className="quiz-result-correct">
                          <span className="quiz-result-icon">✅</span>
                          <span className="quiz-result-text">Правильно!</span>
                        </div>
                      ) : (
                        <div className="quiz-result-incorrect">
                          <span className="quiz-result-icon">❌</span>
                          <span className="quiz-result-text">Неправильно</span>
                        </div>
                      );
                    })()
                  ) : null}
                </div>
              )}

              {showExplanation && question.explanation && (
                <div className="quiz-explanation">
                  <h3 className="quiz-explanation-title">Пояснение:</h3>
                  <p className="quiz-explanation-text">{question.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <button
                  className="quiz-next-button"
                  onClick={handleNext}
                >
                  {questionNumber === totalQuestions ? 'Завершить' : 'Следующий вопрос'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
