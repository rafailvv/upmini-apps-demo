import React, { useState, useEffect } from 'react';
import '../styles.css';
import type { QuizQuestion } from '../QuizApp';

interface QuizQuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: number | number[] | string | number[][]) => void;
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
  const [matchingPairs, setMatchingPairs] = useState<number[][]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setOpenAnswer('');
    setMatchingPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
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
    // Reset result state before navigation to prevent visual glitches
    setShowResult(false);
    setShowExplanation(false);
    
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
    } else if (question.type === 'matching') {
      if (matchingPairs.length > 0) {
        onAnswer(matchingPairs);
      }
    }
  };

  const handleSkip = () => {
    // Reset result state before skipping to prevent visual glitches
    setShowResult(false);
    setShowExplanation(false);
    onSkip();
  };

  const handleHintToggle = () => {
    setShowHint(!showHint);
  };


  const handleMatchingSubmit = () => {
    if (matchingPairs.length === 0 || answerSubmitted) return;
    setShowResult(true);
    setShowExplanation(true);
    setAnswerSubmitted(true);
    // No automatic flip - card stays flipped until user clicks "Далее"
  };

  const handleLeftSelect = (index: number) => {
    if (showResult || answerSubmitted) return;
    setSelectedLeft(index);
    setSelectedRight(null); // Сбрасываем правый выбор
  };

  const handleRightSelect = (index: number) => {
    if (showResult || answerSubmitted) return;
    
    if (selectedLeft !== null) {
      // Создаем пару
      const existingPairIndex = matchingPairs.findIndex(pair => pair[0] === selectedLeft);
      
      if (existingPairIndex !== -1) {
        // Заменяем существующую пару
        const newPairs = [...matchingPairs];
        newPairs[existingPairIndex] = [selectedLeft, index];
        setMatchingPairs(newPairs);
      } else {
        // Добавляем новую пару
        setMatchingPairs([...matchingPairs, [selectedLeft, index]]);
      }
      
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight(index);
    }
  };

  const isCorrectPair = (leftIndex: number, rightIndex: number) => {
    if (!question.correctMatches) return false;
    return question.correctMatches.some(correctMatch => 
      correctMatch[0] === leftIndex && correctMatch[1] === rightIndex
    );
  };

  const removePair = (leftIndex: number) => {
    setMatchingPairs(matchingPairs.filter(pair => pair[0] !== leftIndex));
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
            <span className="quiz-timer-text">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Question content */}
      <div className="quiz-question-content">
        {/* Question card */}
        <div className={`quiz-question-card dynamic-height ${showHint ? 'with-hint' : ''}`}>
          {/* Question type indicator - inside card */}
          <div className="quiz-question-type-indicator">
            {question.type === 'multiple' ? 'Выбери несколько правильных ответов' : 
             question.type === 'open' ? 'Введи ответ в текстовое поле' : 
             question.type === 'matching' ? 'Сопоставь элементы из двух колонок' :
             'Выбери один правильный ответ'}
          </div>
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
              ) : question.type === 'matching' ? (
                <div className="quiz-matching-container">
                  <div className="quiz-matching-columns">
                    <div className="quiz-matching-left">
                      <h4>Страны</h4>
                      {question.leftColumn?.map((item, index) => {
                        const isPaired = matchingPairs.some(pair => pair[0] === index);
                        const isSelected = selectedLeft === index;
                        const pairIndex = matchingPairs.findIndex(pair => pair[0] === index);
                        const colors = ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];
                        const pairColor = pairIndex !== -1 ? colors[pairIndex % colors.length] : null;
                        
                        // Если элемент выбран, но еще не в паре, показываем следующий доступный цвет
                        let displayColor = pairColor;
                        if (isSelected && !isPaired) {
                          const usedColors = matchingPairs.map((_, idx) => colors[idx % colors.length]);
                          const availableColor = colors.find(color => !usedColors.includes(color)) || colors[matchingPairs.length % colors.length];
                          displayColor = availableColor;
                        }
                        
                        return (
                          <div
                            key={index}
                            className={`quiz-matching-item ${isPaired ? 'paired' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleLeftSelect(index)}
                            style={displayColor ? { 
                              borderColor: displayColor, 
                              backgroundColor: `${displayColor}20`,
                              color: displayColor 
                            } : {}}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                    <div className="quiz-matching-right">
                      <h4>Столицы</h4>
                      {question.rightColumn?.map((item, index) => {
                        const isPaired = matchingPairs.some(pair => pair[1] === index);
                        const isSelected = selectedRight === index;
                        const pairIndex = matchingPairs.findIndex(pair => pair[1] === index);
                        const colors = ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];
                        const pairColor = pairIndex !== -1 ? colors[pairIndex % colors.length] : null;
                        
                        // Если элемент выбран, но еще не в паре, показываем следующий доступный цвет
                        let displayColor = pairColor;
                        if (isSelected && !isPaired) {
                          const usedColors = matchingPairs.map((_, idx) => colors[idx % colors.length]);
                          const availableColor = colors.find(color => !usedColors.includes(color)) || colors[matchingPairs.length % colors.length];
                          displayColor = availableColor;
                        }
                        
                        return (
                          <div
                            key={index}
                            className={`quiz-matching-item ${isPaired ? 'paired' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleRightSelect(index)}
                            style={displayColor ? { 
                              borderColor: displayColor, 
                              backgroundColor: `${displayColor}20`,
                              color: displayColor 
                            } : {}}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  
                  {matchingPairs.length > 0 && (
                    <div className="quiz-matching-pairs">
                      <h4>Созданные соответствия:</h4>
                      {matchingPairs.map((pair, index) => {
                        const colors = ['#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];
                        const color = colors[index % colors.length];
                        const isCorrect = isCorrectPair(pair[0], pair[1]);
                        
                        return (
                          <div key={index} className={`quiz-matching-pair ${(showResult || answerSubmitted) && isCorrect ? 'correct' : (showResult || answerSubmitted) && !isCorrect ? 'incorrect' : ''}`}>
                            <div 
                              className="quiz-matching-pair-color" 
                              style={{ backgroundColor: color }}
                            ></div>
                            <span className="quiz-matching-pair-text">
                              {question.leftColumn?.[pair[0]]} → {question.rightColumn?.[pair[1]]}
                            </span>
                            {(showResult || answerSubmitted) && (
                              <span className="quiz-matching-pair-status">
                                {isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                              </span>
                            )}
                            {!showResult && !answerSubmitted && (
                              <button
                                className="quiz-matching-remove-btn"
                                onClick={() => removePair(pair[0])}
                                title="Удалить соответствие"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                    onClick={handleSkip}
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
                  
                  {question.type === 'matching' && matchingPairs.length > 0 && (
                    <button
                      className="quiz-submit-button"
                      onClick={handleMatchingSubmit}
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
