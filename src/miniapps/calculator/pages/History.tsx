import React, { useState } from 'react';
import '../styles.css';

interface CalculationHistory {
  id: number;
  expression: string;
  result: string;
  timestamp: Date;
}

export const History: React.FC = () => {
  const [history, setHistory] = useState<CalculationHistory[]>([
    {
      id: 1,
      expression: '15 + 27',
      result: '42',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 минут назад
    },
    {
      id: 2,
      expression: '100 ÷ 4',
      result: '25',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 минут назад
    },
    {
      id: 3,
      expression: '8 × 7',
      result: '56',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
    },
    {
      id: 4,
      expression: '50 - 12',
      result: '38',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
    },
  ]);

  const clearHistory = () => {
    setHistory([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} дн назад`;
  };

  return (
    <div className="calculator-history">
      <div className="history-header">
        <h2>История вычислений</h2>
        <button onClick={clearHistory} className="clear-history-btn">
          Очистить историю
        </button>
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <p>История вычислений пуста</p>
          <p>Выполните несколько вычислений, чтобы увидеть их здесь</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-expression">
                <span className="expression">{item.expression}</span>
                <span className="equals">=</span>
                <span className="result">{item.result}</span>
              </div>
              <div className="history-time">
                {formatTime(item.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="history-stats">
        <p>Всего вычислений: {history.length}</p>
        {history.length > 0 && (
          <p>Последнее вычисление: {formatTime(history[0].timestamp)}</p>
        )}
      </div>
    </div>
  );
}; 