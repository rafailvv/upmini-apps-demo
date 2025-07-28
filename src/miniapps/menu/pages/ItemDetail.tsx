import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGlobalCart, getGlobalCart, subscribeToCartUpdates } from './MenuList';
import { initTelegramMiniApp } from '../../../utils/telegramUtils';

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

export const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const navigate = useNavigate();
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

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
      setIsInCart(cart.some(cartItem => cartItem.id === item.id));
    });
    
    // Инициализируем состояние корзины
    const cart = getGlobalCart();
    setIsInCart(cart.some(cartItem => cartItem.id === item.id));
    
    return unsubscribe;
  }, [item.id]);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="item-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/miniapp/menu')}>
          ←
        </button>
        <h1 className="detail-title">{item.name}</h1>
        <button 
          className={`favorite-btn-detail ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Main Image */}
      <div className="item-image-large">
        <div className="image-placeholder-large"></div>
        <button 
          className={`add-to-cart-btn-large ${isInCart ? 'active' : ''}`}
          onClick={handleAddToCart}
        >
          {isInCart ? '✓' : '+'}
        </button>
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
      <div className="bottom-action-bar">
        <span className="total-price">{isInCart ? getTotalPrice() : 0} ₽</span>
        <span className="price-dot">•</span>
        <button 
          className={`add-to-cart-btn-detail ${isInCart ? 'active' : ''}`} 
          onClick={handleAddToCart}
        >
          {isInCart ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
}; 