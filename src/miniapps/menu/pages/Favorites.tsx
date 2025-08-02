import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTelegramHeaderOffset } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { Sidebar } from '../components/Sidebar';

interface MenuItem {
  id: number;
  name: string;
  weight: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  addons?: string[];
  comment?: string;
  selectedAddons?: number[];
}

// Импортируем функции из MenuList.tsx
import { 
  addToGlobalCart, 
  getGlobalCart, 
  removeFromGlobalCart,
  subscribeToCartUpdates 
} from './MenuList';

// Все доступные блюда из меню (те же данные, что и в MenuList)
const allMenuItems: MenuItem[] = [
  // НАШИ ХИТЫ
  {
    id: 1,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'hits'
  },
  {
    id: 2,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'hits'
  },
  {
    id: 3,
    name: 'Стейк из говядины',
    weight: '250 г',
    description: 'Говядина, овощи гриль, соус',
    price: 800,
    image: '/images/carbonara.jpg',
    tags: ['ПОПУЛЯРНОЕ'],
    category: 'hits'
  },
  {
    id: 4,
    name: 'Цезарь с курицей',
    weight: '280 г',
    description: 'Салат, курица, сухарики, соус цезарь',
    price: 350,
    image: '/images/carbonara.jpg',
    tags: ['ЛЕГКОЕ'],
    category: 'hits'
  },
  // ОСНОВНЫЕ БЛЮДА
  {
    id: 5,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 6,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 7,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 8,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 9,
    name: 'Паста Болоньезе',
    weight: '320 г',
    description: 'Паста, фарш, томатный соус, пармезан',
    price: 450,
    image: '/api/placeholder/300/200',
    tags: ['КЛАССИКА'],
    category: 'main'
  }
];

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [, setForceUpdate] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    addTelegramHeaderOffset();
    
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
                    <div className="item-weight">{item.weight}</div>
                    <div className="item-description">{item.description}</div>
                    <div className="item-price">{item.price} ₽</div>
                    <div className="item-tags">
                      {item.tags.map((tag: string, index: number) => (
                        <span key={index} className={`tag tag-${tag}`}>
                          {tag.toUpperCase()}
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