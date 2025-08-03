import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // Определяем активный раздел
  const isMenuActive = location.pathname === '/miniapp/menu';
  const isFavoritesActive = location.pathname === '/miniapp/menu/favorites';
  const isPastOrdersActive = location.pathname === '/miniapp/menu/past-orders';

  return (
    <>
      {/* Overlay */}
      <div 
        className={`overlay ${isOpen ? '' : 'hidden'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="user-block">
          {(() => {
            const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
            // Telegram MiniApp API иногда возвращает поле photo_url
            const photoUrl = user?.photo_url;
            if (photoUrl) {
              return (
                <img
                  src={photoUrl}
                  alt="Аватар пользователя"
                  className="sidebar-logo-large"
                />
              );
            } else {
              return (
                <div className="sidebar-logo-emoji">
                  😊
                </div>
              );
            }
          })()}
          <span className="sidebar-username-large">
            {(() => {
              const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
              if (!user || (!user.first_name && !user.last_name)) {
                return 'Пользователь';
              }
              const { first_name, last_name } = user;
              return last_name
                ? `${first_name} ${last_name}`
                : first_name;
            })()}
          </span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={`nav-item ${isMenuActive ? 'active' : ''}`} onClick={() => handleNavigation('/miniapp/menu')}>
              Меню
            </li>
            <li className={`nav-item ${isFavoritesActive ? 'active' : ''}`} onClick={() => handleNavigation('/miniapp/menu/favorites')}>
              Избранное
            </li>
            <li className={`nav-item ${isPastOrdersActive ? 'active' : ''}`} onClick={() => handleNavigation('/miniapp/menu/past-orders')}>
              Прошлые заказы
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}; 