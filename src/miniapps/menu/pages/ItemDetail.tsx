import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGlobalCart, getGlobalCart, subscribeToCartUpdates, removeFromGlobalCart, updateGlobalCartItemWithData, updateCartItemCommentWithAddons } from './MenuList';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { getAddonsForItem, calculateAddonsPrice, type Addon } from '../utils/addonsManager';

interface RecommendedItem {
  id: number;
  name: string;
  volume: string;
  description: string;
  price: number;
}

interface ItemDetailProps {
  item: {
    id: number;
    name: string;
    weight: string;
    description: string;
    price: number;
    image: string;
    tags: string[];
    category: string;
  };
}

// Функция для склонения слова "штук"
const getQuantityText = (quantity: number): string => {
  const lastDigit = quantity % 10;
  const lastTwoDigits = quantity % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'штук';
  }
  
  switch (lastDigit) {
    case 1:
      return 'штука';
    case 2:
    case 3:
    case 4:
      return 'штуки';
    default:
      return 'штук';
  }
};

export const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const navigate = useNavigate();
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const addons: Addon[] = getAddonsForItem(item.id);

  const recommendedItems: RecommendedItem[] = [
    {
      id: 1,
      name: 'Каберне Совиньон',
      volume: '120 мл',
      description: 'Терпкое, танинное, с ароматом чёрной смородины',
      price: 250,
    },
    {
      id: 2,
      name: 'Каберне Совиньон',
      volume: '120 мл',
      description: 'Терпкое, танинное, с ароматом чёрной смородины',
      price: 250,
    },
  ];

  // Подписываемся на обновления корзины и избранного
  useEffect(() => {
    const unsubscribeCart = subscribeToCartUpdates(() => {
      const cart = getGlobalCart();
      const cartItem = cart.find(cartItem => cartItem.id === item.id);
      setIsInCart(!!cartItem);
      setCartQuantity(cartItem ? cartItem.quantity : 0);
      
      // Загружаем сохраненные данные
      if (cartItem) {
        setComment(cartItem.comment || '');
        setSelectedAddons(cartItem.selectedAddons || []);
        // Если товар в корзине, показываем состояние pressed
        setIsButtonPressed(true);
      }
    });

    const unsubscribeFavorites = subscribeToFavoritesUpdates(() => {
      const favorites = getFavorites();
      setIsFavorite(!!favorites[item.id]);
    });
    
    // Инициализируем состояние корзины и избранного
    const cart = getGlobalCart();
    const cartItem = cart.find(cartItem => cartItem.id === item.id);
    setIsInCart(!!cartItem);
    setCartQuantity(cartItem ? cartItem.quantity : 0);
    
    // Загружаем сохраненные данные при инициализации
    if (cartItem) {
      setComment(cartItem.comment || '');
      setSelectedAddons(cartItem.selectedAddons || []);
      // Если товар в корзине, показываем состояние pressed
      setIsButtonPressed(true);
    }

    const favorites = getFavorites();
    setIsFavorite(!!favorites[item.id]);
    
    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, [item.id]);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  const handleAddonToggle = (addonId: number) => {
    const newSelectedAddons = selectedAddons.includes(addonId) 
      ? selectedAddons.filter(id => id !== addonId)
      : [...selectedAddons, addonId];
    
    setSelectedAddons(newSelectedAddons);
    
    // Если товар в корзине, сохраняем изменения
    if (isInCart) {
      updateCartItemCommentWithAddons(item.id, comment, newSelectedAddons);
    }
  };

  const getTotalPrice = () => {
    const addonsPrice = calculateAddonsPrice(selectedAddons);
    return item.price + addonsPrice;
  };



  const handleDecreaseQuantity = () => {
    if (cartQuantity === 1) {
      removeFromGlobalCart(item.id);
      // Если удалили последний товар, возвращаемся к обычному состоянию
      setIsButtonPressed(false);
    } else {
      updateGlobalCartItemWithData(item.id, cartQuantity - 1, comment, selectedAddons);
    }
  };

  const handleIncreaseQuantity = () => {
    addToGlobalCart(item, comment, selectedAddons);
    // Если товар был добавлен в корзину через состояние pressed, оставляем состояние pressed
    // Состояние автоматически обновится через useEffect при изменении корзины
  };

  const toggleFavorite = () => {
    toggleGlobalFavorite(item.id);
  };

  const handleButtonPress = () => {
    if (!isInCart) {
      // Сразу добавляем товар в корзину
      addToGlobalCart(item, comment, selectedAddons);
      // Показываем состояние pressed
      setIsButtonPressed(true);
    }
  };

  const handleBackClick = () => {
    setIsButtonPressed(false);
    navigate('/miniapp/menu');
  };

  const handleGoToCart = () => {
    navigate('/miniapp/menu/cart');
  };

  return (
    <div className="item-detail-page">
      {/* Header */}
      <div className="detail-header">
        <h1 className="detail-title">{item.name}</h1>
      </div>

      {/* Main Image */}
      <div className="item-image-large">
        <button 
          className={`favorite-btn-large ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
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
          className="image-placeholder-large"
          style={{ display: 'none' }}
        >
        </div>
      </div>

      {/* Item Info */}
      <div className="item-info-detail">
        <h2 className="item-name-detail">{item.name}</h2>
        <p className="item-weight-detail">{item.weight}</p>
        <p className="item-description-detail">
          Нежная паста. Очень вкусная. Фаворит среди наших гостей. Текст. Можем приготовить с собой.
        </p>
      </div>

      {/* Add-ons Section */}
      <div className="addons-section">
        <h3 className="section-title-detail">Добавки</h3>
        <div className="addons-list">
          {addons.map((addon) => (
            <label key={addon.id} className="addon-item">
              <input
                type="checkbox"
                checked={selectedAddons.includes(addon.id)}
                onChange={() => handleAddonToggle(addon.id)}
                className="addon-checkbox"
              />
              <span className="addon-name">{addon.name}</span>
              <span className="addon-price">+ {addon.price} ₽</span>
            </label>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="section-title-detail">Комментарий</h3>
        <textarea
          className="comment-input"
          placeholder="Сделайте поострее, пожалуйста..."
          value={comment}
          onChange={(e) => {
            const newComment = e.target.value;
            setComment(newComment);
            
            // Сохраняем комментарий в корзине при вводе
            if (isInCart) {
              updateCartItemCommentWithAddons(item.id, newComment, selectedAddons);
            }
          }}
        />
      </div>

      {/* Recommended Items */}
      <div className="recommended-section">
        <h3 className="section-title-detail">Лучшие дополнения</h3>
        <div className="recommended-list">
          {recommendedItems.map((recItem) => (
            <div key={recItem.id} className="recommended-item">
              <div className="rec-item-image">
                <div className="image-placeholder-small"></div>
              </div>
              <div className="rec-item-info">
                <h4 className="rec-item-name">{recItem.name}</h4>
                <p className="rec-item-volume">{recItem.volume}</p>
                <p className="rec-item-description">{recItem.description}</p>
              </div>
              <button className="rec-item-arrow">→</button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`bottom-action-bar ${isInCart ? 'active' : ''} ${isButtonPressed ? 'pressed' : ''}`} onClick={!isInCart ? handleButtonPress : undefined}>
        {!isInCart && !isButtonPressed ? (
          <span className="total-price">В корзину – {getTotalPrice()} ₽</span>
        ) : !isInCart && isButtonPressed ? (
          <>
            <button 
              className="action-btn back-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBackClick();
              }}
            >
              ← Назад
            </button>
            <button 
              className="quantity-btn minus"
              onClick={(e) => {
                e.stopPropagation();
                if (cartQuantity > 0) {
                  handleDecreaseQuantity();
                }
              }}
            >
              {cartQuantity === 1 ? (
                <span className="material-symbols-outlined">delete</span>
              ) : (
                '−'
              )}
            </button>
            <span className="total-price">{getTotalPrice()} ₽</span>
            <button 
              className="quantity-btn plus"
              onClick={(e) => {
                e.stopPropagation();
                handleIncreaseQuantity();
              }}
            >
              +
            </button>
            <button 
              className="action-btn cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleGoToCart();
              }}
            >
              В корзину →
            </button>
          </>
        ) : isInCart && isButtonPressed ? (
          <>
            <button 
              className="action-btn back-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBackClick();
              }}
            >
              ← Назад
            </button>
            <button 
              className="quantity-btn minus"
              onClick={(e) => {
                e.stopPropagation();
                if (cartQuantity > 0) {
                  handleDecreaseQuantity();
                }
              }}
            >
              {cartQuantity === 1 ? (
                <span className="material-symbols-outlined">delete</span>
              ) : (
                '−'
              )}
            </button>
            <span className="total-price">{cartQuantity} {getQuantityText(cartQuantity)} – {getTotalPrice() * cartQuantity} ₽</span>
            <button 
              className="quantity-btn plus"
              onClick={(e) => {
                e.stopPropagation();
                handleIncreaseQuantity();
              }}
            >
              +
            </button>
            <button 
              className="action-btn cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleGoToCart();
              }}
            >
              В корзину →
            </button>
          </>
        ) : (
          <>
            <button 
              className="quantity-btn minus"
              onClick={(e) => {
                e.stopPropagation();
                handleDecreaseQuantity();
              }}
            >
              {cartQuantity === 1 ? (
                <span className="material-symbols-outlined">delete</span>
              ) : (
                '−'
              )}
            </button>
            <span className="total-price">{cartQuantity} {getQuantityText(cartQuantity)} – {getTotalPrice() * cartQuantity} ₽</span>
            <button 
              className="quantity-btn plus"
              onClick={(e) => {
                e.stopPropagation();
                handleIncreaseQuantity();
              }}
            >
              +
            </button>
          </>
        )}
      </div>
    </div>
  );
}; 