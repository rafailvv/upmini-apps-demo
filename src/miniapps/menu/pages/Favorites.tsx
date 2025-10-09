import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTelegramHeaderOffset } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { Sidebar } from '../components/Sidebar';
import { getMenuItems, getTagsForItem, type MenuItem } from '../utils/dataLoader';
import { loadThemeSettings, applyThemeSettings } from '../utils/themeLoader';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  addons?: string[];
  comment?: string;
  selectedAddons?: number[];
  selectedVariation?: number; // индекс выбранной вариации
}

// Импортируем функции из MenuList.tsx
import { 
  addToGlobalCart, 
  getGlobalCart, 
  removeFromGlobalCart,
  subscribeToCartUpdates 
} from './MenuList';

// Все доступные блюда из меню
const allMenuItems: MenuItem[] = getMenuItems();

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [, setForceUpdate] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    addTelegramHeaderOffset();
    
    // Загружаем и применяем тему
    const loadTheme = async () => {
      try {
        const themeSettings = await loadThemeSettings();
        applyThemeSettings(themeSettings);
      } catch (error) {
        console.error('Ошибка загрузки темы:', error);
      }
    };
    
    loadTheme();
    
    // Подписываемся на изменения корзины
    const unsubscribeCart = subscribeToCartUpdates(() => {
      setCart(getGlobalCart());
    });

    // Подписываемся на изменения избранного
    const unsubscribeFavorites = subscribeToFavoritesUpdates(() => {
      setForceUpdate(prev => prev + 1); // Принудительно обновляем компонент
    });

    // Загружаем текущее состояние корзины
    setCart(getGlobalCart());

    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, []);

  // Создаем объект для быстрой проверки товаров в корзине
  const cartItemsMap = cart.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {} as { [key: number]: number });

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      // Если товар уже в корзине, удаляем его
      removeFromGlobalCart(item.id);
    } else {
      // Если товара нет в корзине, добавляем его
      addToGlobalCart(item);
    }
  };



  const handleItemClick = (itemId: number) => {
    navigate(`/miniapp/menu/item/${itemId}`);
  };

  const toggleFavorite = (itemId: number) => {
    toggleGlobalFavorite(itemId);
  };

  // Функция для обрезки текста
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Фильтруем только избранные элементы из глобального состояния
  const favoriteItems = allMenuItems.filter(item => getFavorites()[item.id]);



  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="menu-app favorites-page">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      {/* Header */}
      <div className="menu-header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(prev => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <h2 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#333',
              textAlign: 'center',
              width: '100%'
            }}>
              Избранное
            </h2>
          </div>
        </div>

        <div className="header-right">
          <button
            className="cart-icon"
            onClick={() => navigate('/miniapp/menu/cart')}
          >
            🛒
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="menu-content">
        {favoriteItems.length > 0 ? (
          <div className="menu-section">
            <div className="menu-grid">
                          {favoriteItems.map((item: MenuItem) => (
              <div key={item.id} className="menu-item-card" onClick={() => handleItemClick(item.id)}>
                                  <div className="item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="image-placeholder"
                    style={{ display: 'none' }}
                  >
                  </div>
                    <button
                      className={`favorite-btn ${getFavorites()[item.id] ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                    >
                      {getFavorites()[item.id] ? '❤️' : '🤍'}
                    </button>
                    <button
                      className={`add-to-cart-btn ${cartItemsMap[item.id] ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      {cartItemsMap[item.id] ? '✓' : '+'}
                    </button>
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-description">{truncateText(item.description, 80)}</div>
                    <div className="item-price">{item.price} ₽</div>
                    <div className="item-tags">
                      {getTagsForItem(item.id).map((tag) => (
                        <span
                          key={tag.id}
                          className="item-tag"
                          style={{
                            color: tag.color,
                            backgroundColor: tag.backgroundColor,
                            border: `1px solid ${tag.color}`
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">❤️</div>
            <h3>Нет избранных блюд</h3>
            <p>Добавьте блюда в избранное, чтобы они появились здесь</p>
            <button 
              className="back-to-menu-btn"
              onClick={() => navigate('/miniapp/menu')}
            >
              Перейти к меню
            </button>
          </div>
        )}
      </div>


    </div>
  );
}; 