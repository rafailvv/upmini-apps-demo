import React, { useState, useEffect } from 'react';
import { QuizStartScreen } from './pages/QuizStartScreen';
import { QuizIntroScreen } from './pages/QuizIntroScreen';
import { QuizQuestionScreen } from './pages/QuizQuestionScreen';
import { QuizResultScreen } from './pages/QuizResultScreen';
import { QuizReviewScreen } from './pages/QuizReviewScreen';
import { ShareNotification } from './components/ShareNotification';
import './styles.css';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  hint?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  correctAnswers: number[];
  wrongAnswers: number[];
}

const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "Какая столица России?",
    options: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"],
    correctAnswer: 0,
    explanation: "Москва является столицей Российской Федерации с 1991 года.",
    hint: "Этот город является крупнейшим в России и расположен в европейской части страны."
  },
  {
    id: 2,
    question: "Сколько планет в Солнечной системе?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 1,
    explanation: "В Солнечной системе 8 планет: Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун.",
    hint: "Плутон больше не считается планетой с 2006 года."
  },
  {
    id: 3,
    question: "Какая формула воды?",
    options: ["H2O", "CO2", "O2", "H2SO4"],
    correctAnswer: 0,
    explanation: "H2O - это химическая формула воды, состоящей из двух атомов водорода и одного атома кислорода."
  },
  {
    id: 4,
    question: "Кто написал роман 'Война и мир'?",
    options: ["Фёдор Достоевский", "Лев Толстой", "Антон Чехов", "Иван Тургенев"],
    correctAnswer: 1,
    explanation: "Лев Николаевич Толстой написал роман 'Война и мир' в 1863-1869 годах."
  },
  {
    id: 5,
    question: "Какая самая большая планета в Солнечной системе?",
    options: ["Земля", "Сатурн", "Юпитер", "Нептун"],
    correctAnswer: 2,
    explanation: "Юпитер - самая большая планета в Солнечной системе, его масса больше массы всех остальных планет вместе взятых."
  }
];



export const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showIntroScreen, setShowIntroScreen] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [shareMessage, setShareMessage] = useState('');


  useEffect(() => {
    let timer: number;
    if (quizStarted && !showResults && timeLeft > 0) {
      timer = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResults]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const calculateResults = (): QuizResult => {
    let correctCount = 0;
    const correctAnswers: number[] = [];
    const wrongAnswers: number[] = [];

    quizData.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
        correctAnswers.push(index);
      } else {
        wrongAnswers.push(index);
      }
    });

    return {
      score: correctCount,
      total: quizData.length,
      percentage: Math.round((correctCount / quizData.length) * 100),
      correctAnswers,
      wrongAnswers
    };
  };


  const startQuiz = (_topic: string) => {
    setShowStartScreen(false);
    setShowIntroScreen(true);
  };

  const proceedToQuiz = () => {
    setShowIntroScreen(false);
    setQuizStarted(true);
  };

  const backToStart = () => {
    setShowIntroScreen(false);
    setShowStartScreen(true);
  };

  const handleReview = () => {
    setShowReviewScreen(true);
  };

  const handleBackFromReview = () => {
    setShowReviewScreen(false);
  };

  const handleShare = () => {
    const result = calculateResults();
    const shareText = `🧠 Результат квиза: ${result.score} из ${result.total} (${result.percentage}%)\n\n`;
    const shareUrl = window.location.href;
    
    // Создаем текст для шеринга
    const fullShareText = `${shareText}Проверьте свои знания в квизе! ${shareUrl}`;
    
    // Пробуем использовать Web Share API (для мобильных устройств)
    if (navigator.share) {
      navigator.share({
        title: 'Результат квиза',
        text: fullShareText,
        url: shareUrl
      }).catch((error) => {
        console.log('Ошибка при шеринге:', error);
        fallbackShare(fullShareText);
      });
    } else {
      // Fallback для десктопов
      fallbackShare(fullShareText);
    }
  };

  const fallbackShare = (text: string) => {
    // Копируем в буфер обмена
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShareMessage('Результат скопирован в буфер обмена!');
        setShowShareNotification(true);
      }).catch(() => {
        // Если не удалось скопировать, показываем модальное окно
        showShareModal(text);
      });
    } else {
      // Для старых браузеров
      showShareModal(text);
    }
  };

  const showShareModal = (text: string) => {
    // Создаем временный textarea для копирования
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand('copy');
      setShareMessage('Результат скопирован в буфер обмена!');
      setShowShareNotification(true);
    } catch (err) {
      setShareMessage('Не удалось скопировать. Текст: ' + text);
      setShowShareNotification(true);
    }
    
    document.body.removeChild(textarea);
  };

  if (showStartScreen) {
    return <QuizStartScreen onStart={startQuiz} />;
  }

  if (showIntroScreen) {
    return <QuizIntroScreen onProceed={proceedToQuiz} onBack={backToStart} />;
  }

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-start">
          <h1 className="quiz-title">🧠 Квиз на общие знания</h1>
          <p className="quiz-description">
            Проверьте свои знания! Вам предстоит ответить на {quizData.length} вопросов за 30 секунд.
          </p>
          <div className="quiz-info">
            <div className="quiz-info-item">
              <span className="quiz-info-label">Вопросов:</span>
              <span className="quiz-info-value">{quizData.length}</span>
            </div>
            <div className="quiz-info-item">
              <span className="quiz-info-label">Время:</span>
              <span className="quiz-info-value">30 сек</span>
            </div>
          </div>
          <button className="quiz-start-button" onClick={() => startQuiz('Общие знания')}>
            Начать квиз
          </button>
        </div>
      </div>
    );
  }

  if (showReviewScreen) {
    return (
      <>
        <QuizReviewScreen 
          questions={quizData}
          userAnswers={answers}
          onBack={handleBackFromReview}
        />
        <ShareNotification
          isVisible={showShareNotification}
          onClose={() => setShowShareNotification(false)}
          message={shareMessage}
        />
      </>
    );
  }

  if (showResults) {
    return (
      <>
        <QuizResultScreen 
          result={calculateResults()} 
          onReview={handleReview}
          onShare={handleShare}
        />
        <ShareNotification
          isVisible={showShareNotification}
          onClose={() => setShowShareNotification(false)}
          message={shareMessage}
        />
      </>
    );
  }

  return (
    <>
      <QuizQuestionScreen
        question={quizData[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quizData.length}
        onAnswer={handleAnswer}
        onSkip={() => handleAnswer(-1)} // -1 indicates skipped
        timeLeft={timeLeft}
      />
      <ShareNotification
        isVisible={showShareNotification}
        onClose={() => setShowShareNotification(false)}
        message={shareMessage}
      />
    </>
  );
};
