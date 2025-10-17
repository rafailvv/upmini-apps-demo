import React from 'react';
import '../styles.css';
import type { QuizQuestion } from '../QuizApp';

interface QuizReviewScreenProps {
  questions: QuizQuestion[];
  userAnswers: number[];
  onBack: () => void;
}

export const QuizReviewScreen: React.FC<QuizReviewScreenProps> = ({
  questions,
  userAnswers,
  onBack
}) => {
  const getAnswerStatus = (questionIndex: number) => {
    const userAnswer = userAnswers[questionIndex];
    const correctAnswer = questions[questionIndex].correctAnswer;
    
    if (userAnswer === -1) {
      return { status: 'skipped', text: 'Пропущен' };
    } else if (userAnswer === correctAnswer) {
      return { status: 'correct', text: 'Правильно' };
    } else {
      return { status: 'incorrect', text: 'Неправильно' };
    }
  };

  const getAnswerClass = (questionIndex: number, optionIndex: number) => {
    const userAnswer = userAnswers[questionIndex];
    const correctAnswer = questions[questionIndex].correctAnswer;
    
    if (optionIndex === correctAnswer) {
      return 'quiz-review-answer-correct';
    } else if (optionIndex === userAnswer && userAnswer !== correctAnswer) {
      return 'quiz-review-answer-incorrect';
    } else {
      return 'quiz-review-answer-neutral';
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

                <div className="quiz-review-answers">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`quiz-review-answer ${getAnswerClass(questionIndex, optionIndex)}`}
                    >
                      <span className="quiz-review-answer-letter">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="quiz-review-answer-text">{option}</span>
                      {optionIndex === questions[questionIndex].correctAnswer && (
                        <span className="quiz-review-correct-icon">✓</span>
                      )}
                      {optionIndex === userAnswers[questionIndex] && userAnswers[questionIndex] !== questions[questionIndex].correctAnswer && (
                        <span className="quiz-review-incorrect-icon">✗</span>
                      )}
                    </div>
                  ))}
                </div>

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
