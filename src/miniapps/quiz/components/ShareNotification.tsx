import React, { useEffect } from 'react';
import '../styles.css';

interface ShareNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
}

export const ShareNotification: React.FC<ShareNotificationProps> = ({
  isVisible,
  onClose,
  message
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Автоматически закрываем через 3 секунды

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="share-notification-overlay">
      <div className="share-notification">
        <div className="share-notification-icon">✅</div>
        <div className="share-notification-message">{message}</div>
        <button 
          className="share-notification-close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};
