import React, { useState } from 'react';
import '../styles.css';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    { text: 'C', onClick: clear, className: 'clear' },
    { text: '±', onClick: () => setDisplay(String(-parseFloat(display))), className: 'function' },
    { text: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), className: 'function' },
    { text: '÷', onClick: () => performOperation('÷'), className: 'operator' },
    { text: '7', onClick: () => inputDigit('7'), className: 'digit' },
    { text: '8', onClick: () => inputDigit('8'), className: 'digit' },
    { text: '9', onClick: () => inputDigit('9'), className: 'digit' },
    { text: '×', onClick: () => performOperation('×'), className: 'operator' },
    { text: '4', onClick: () => inputDigit('4'), className: 'digit' },
    { text: '5', onClick: () => inputDigit('5'), className: 'digit' },
    { text: '6', onClick: () => inputDigit('6'), className: 'digit' },
    { text: '-', onClick: () => performOperation('-'), className: 'operator' },
    { text: '1', onClick: () => inputDigit('1'), className: 'digit' },
    { text: '2', onClick: () => inputDigit('2'), className: 'digit' },
    { text: '3', onClick: () => inputDigit('3'), className: 'digit' },
    { text: '+', onClick: () => performOperation('+'), className: 'operator' },
    { text: '0', onClick: () => inputDigit('0'), className: 'digit zero' },
    { text: '.', onClick: inputDecimal, className: 'digit' },
    { text: '=', onClick: handleEquals, className: 'equals' },
  ];

  return (
    <div className="calculator">
      <div className="calculator-display">
        <div className="calculator-expression">
          {previousValue !== null && operation && `${previousValue} ${operation}`}
        </div>
        <div className="calculator-value">{display}</div>
      </div>
      
      <div className="calculator-buttons">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`calculator-button ${button.className}`}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}; 