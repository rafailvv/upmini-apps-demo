import React, { useState, useEffect } from 'react';
import { addToGlobalCart, getGlobalCart, subscribeToCartUpdates, removeFromGlobalCart, updateGlobalCartItem } from './MenuList';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';

interface Addon {
  id: number;
  name: string;
  price: number;
}

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
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  const addons: Addon[] = [
    { id: 1, name: 'Поджаренный хлеб', price: 50 },
    { id: 2, name: 'Аддон 2', price: 100 },
    { id: 3, name: 'Аддон 3', price: 60 },
  ];

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

  // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      const cart = getGlobalCart();
      const cartItem = cart.find(cartItem => cartItem.id === item.id);
      setIsInCart(!!cartItem);
      setCartQuantity(cartItem ? cartItem.quantity : 0);
    });
    
    // Инициализируем состояние корзины
    const cart = getGlobalCart();
    const cartItem = cart.find(cartItem => cartItem.id === item.id);
    setIsInCart(!!cartItem);
    setCartQuantity(cartItem ? cartItem.quantity : 0);
    
    return unsubscribe;
  }, [item.id]);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  const handleAddonToggle = (addonId: number) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getTotalPrice = () => {
    const addonsPrice = addons
      .filter(addon => selectedAddons.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
    return item.price + addonsPrice;
  };

  const handleAddToCart = () => {
    const selectedAddonNames = addons
      .filter(addon => selectedAddons.includes(addon.id))
      .map(addon => addon.name);

    const itemWithAddons = {
      ...item,
      addons: selectedAddonNames
    };

    addToGlobalCart(itemWithAddons);
  };

  const handleDecreaseQuantity = () => {
    if (cartQuantity === 1) {
      removeFromGlobalCart(item.id);
    } else {
      updateGlobalCartItem(item.id, cartQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    const selectedAddonNames = addons
      .filter(addon => selectedAddons.includes(addon.id))
      .map(addon => addon.name);

    const itemWithAddons = {
      ...item,
      addons: selectedAddonNames
    };

    addToGlobalCart(itemWithAddons);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
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
        <div className="image-placeholder-large"></div>
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
          onChange={(e) => setComment(e.target.value)}
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
      <div className={`bottom-action-bar ${isInCart ? 'active' : ''}`} onClick={!isInCart ? handleAddToCart : undefined}>
        {!isInCart ? (
          <span className="total-price">В корзину – {getTotalPrice()} ₽</span>
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