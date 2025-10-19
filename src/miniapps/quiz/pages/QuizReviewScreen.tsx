import React from 'react';
import '../styles.css';
import type { QuizQuestion } from '../QuizApp';

interface QuizReviewScreenProps {
  questions: QuizQuestion[];
  userAnswers: (number | number[] | string)[];
  onBack: () => void;
}

export const QuizReviewScreen: React.FC<QuizReviewScreenProps> = ({
  questions,
  userAnswers,
  onBack
}) => {
  const getAnswerStatus = (questionIndex: number) => {
    const userAnswer = userAnswers[questionIndex];
    const question = questions[questionIndex];
    
    if (userAnswer === -1 || (question.type === 'open' && (!userAnswer || userAnswer === ''))) {
      return { status: 'skipped', text: 'Пропущен' };
    }
    
    let isCorrect = false;
    if (question.type === 'single' || !question.type) {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'multiple') {
      const correct = question.correctAnswer as number[];
      
      // Проверяем, что userAnswer является массивом (не пропущен)
      if (userAnswer === -1 || !Array.isArray(userAnswer)) {
        return { status: 'skipped', text: 'Пропущен' };
      }
      
      const user = userAnswer as number[];
      isCorrect = correct.every(ans => user.includes(ans)) && user.every(ans => correct.includes(ans));
    } else if (question.type === 'open') {
      isCorrect = typeof userAnswer === 'string' && 
                 userAnswer.toLowerCase().trim() === (question.correctText as string).toLowerCase().trim();
    }
    
    if (isCorrect) {
      return { status: 'correct', text: 'Правильно' };
    } else {
      return { status: 'incorrect', text: 'Неправильно' };
    }
  };

  const getAnswerClass = (questionIndex: number, optionIndex: number) => {
    const userAnswer = userAnswers[questionIndex];
    const question = questions[questionIndex];
    
    if (question.type === 'open') {
      // Для открытых вопросов не показываем варианты ответов
      return 'quiz-review-answer-neutral';
    }
    
    if (question.type === 'multiple') {
      const correctAnswers = question.correctAnswer as number[];
      
      // Проверяем, что userAnswer является массивом (не пропущен)
      if (userAnswer === -1 || !Array.isArray(userAnswer)) {
        // Если вопрос пропущен, показываем только правильные ответы зелеными
        const isCorrect = correctAnswers.includes(optionIndex);
        return isCorrect ? 'quiz-review-answer-correct' : 'quiz-review-answer-neutral';
      }
      
      const userAnswers = userAnswer as number[];
      const isCorrect = correctAnswers.includes(optionIndex);
      const isUserSelected = userAnswers.includes(optionIndex);
      
      if (isCorrect) {
        // Все правильные ответы - зеленые
        return 'quiz-review-answer-correct';
      } else if (!isCorrect && isUserSelected) {
        // Неправильные выбранные - красные
        return 'quiz-review-answer-incorrect';
      } else {
        // Остальные - нейтральные
        return 'quiz-review-answer-neutral';
      }
    } else {
      // Single choice questions
      const correctAnswer = question.correctAnswer;
      
      if (optionIndex === correctAnswer) {
        return 'quiz-review-answer-correct';
      } else if (optionIndex === userAnswer && userAnswer !== correctAnswer) {
        return 'quiz-review-answer-incorrect';
      } else {
        return 'quiz-review-answer-neutral';
      }
    }
  };

  return (
    <div className="quiz-review-container">
      <div className="quiz-review-content">
        {/* Header */}
        <div className="quiz-review-header">
          <button className="quiz-review-back-button" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="quiz-review-title">Разбор результатов</h1>
        </div>

        {/* Questions Review */}
        <div className="quiz-review-questions">
          {questions.map((question, questionIndex) => {
            const answerStatus = getAnswerStatus(questionIndex);
            
            return (
              <div key={question.id} className="quiz-review-question-card">
                <div className="quiz-review-question-header">
                  <div className="quiz-review-question-number">
                    Вопрос {questionIndex + 1}
                  </div>
                  <div className={`quiz-review-status quiz-review-status-${answerStatus.status}`}>
                    {answerStatus.text}
                  </div>
                </div>

                <div className="quiz-review-question-text">
                  {question.question}
                </div>

                {question.type === 'open' ? (
                  <div className="quiz-review-open-answer">
                    {userAnswers[questionIndex] !== -1 && userAnswers[questionIndex] ? (
                      <div className="quiz-review-open-section">
                        <h4 className="quiz-review-open-title">Ваш ответ:</h4>
                        <p className="quiz-review-user-answer">{userAnswers[questionIndex]}</p>
                      </div>
                    ) : null}
                    <div className="quiz-review-open-section">
                      <h4 className="quiz-review-open-title">Правильный ответ:</h4>
                      <p className="quiz-review-correct-answer">{question.correctText}</p>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-review-answers">
                    {question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`quiz-review-answer ${getAnswerClass(questionIndex, optionIndex)}`}
                      >
                        <span className="quiz-review-answer-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="quiz-review-answer-text">{option}</span>
                        {(() => {
                          const question = questions[questionIndex];
                          const userAnswer = userAnswers[questionIndex];
                          
                          if (question.type === 'multiple') {
                            const correctAnswers = question.correctAnswer as number[];
                            
                            // Проверяем, что userAnswer является массивом (не пропущен)
                            if (userAnswer === -1 || !Array.isArray(userAnswer)) {
                              // Если вопрос пропущен, не показываем иконки
                              return null;
                            }
                            
                            const userAnswers = userAnswer as number[];
                            const isCorrect = correctAnswers.includes(optionIndex);
                            const isUserSelected = userAnswers.includes(optionIndex);
                            
                            if (isCorrect && isUserSelected) {
                              return <span className="quiz-review-correct-icon">✓</span>;
                            } else if (!isCorrect && isUserSelected) {
                              return <span className="quiz-review-incorrect-icon">✗</span>;
                            }
                          } else {
                            // Single choice logic
                            if (optionIndex === userAnswer && optionIndex === question.correctAnswer) {
                              // Пользователь выбрал правильный ответ
                              return <span className="quiz-review-correct-icon">✓</span>;
                            }
                            if (optionIndex === userAnswer && userAnswer !== question.correctAnswer) {
                              // Пользователь выбрал неправильный ответ
                              return <span className="quiz-review-incorrect-icon">✗</span>;
                            }
                          }
                          return null;
                        })()}
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <div className="quiz-review-explanation">
                    <div className="quiz-review-explanation-title">Пояснение:</div>
                    <div className="quiz-review-explanation-text">
                      {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
