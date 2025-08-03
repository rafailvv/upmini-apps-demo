import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGlobalCart, getGlobalCart, subscribeToCartUpdates, removeFromGlobalCart, updateGlobalCartItemWithData, updateCartItemCommentWithAddons } from './MenuList';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { getAddonsForItem, calculateAddonsPrice, getRecommendedItemsForItem, type Addon, type MenuItem } from '../utils/dataLoader';

interface ItemDetailProps {
  item: MenuItem;
}

// Функция для склонения слова "шт"
const getQuantityText = (quantity: number): string => {
  const lastDigit = quantity % 10;
  const lastTwoDigits = quantity % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'шт';
  }
  
  switch (lastDigit) {
    case 1:
      return 'шт';
    case 2:
    case 3:
    case 4:
      return 'шт';
    default:
      return 'шт';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const addons: Addon[] = getAddonsForItem(item.id);
  const recommendedItems: MenuItem[] = getRecommendedItemsForItem(item.id);

  // Сброс состояния изображения при изменении товара
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item.id]);

  // Подписываемся на обновления корзины и избранного
  useEffect(() => {
    // Скролл наверх страницы при открытии
    window.scrollTo(0, 0);

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
    
    if (cartItem) {
      setComment(cartItem.comment || '');
      setSelectedAddons(cartItem.selectedAddons || []);
      setIsButtonPressed(true);
    }

    const favorites = getFavorites();
    setIsFavorite(!!favorites[item.id]);

    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, [item.id]); // Добавляем зависимость от item.id

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



  const handleGoToCart = () => {
    navigate('/miniapp/menu/cart');
  };

  const handleBackToMenu = () => {
    navigate('/miniapp/menu');
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
        {item.image && item.image.trim() !== '' ? (
          <img 
            src={`${item.image}?v=${item.id}`} 
            alt={item.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: imageError ? 'none' : 'block'
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={(e) => {
              setImageError(true);
              setImageLoaded(false);
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className="image-placeholder-large"
          style={{ display: (item.image && item.image.trim() !== '' && !imageError) ? 'none' : 'flex' }}
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
            <div 
              key={recItem.id} 
              className="recommended-item"
              onClick={() => {
                navigate(`/miniapp/menu/item/${recItem.id}`);
                // Скролл наверх при переходе к рекомендуемому товару
                window.scrollTo(0, 0);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="rec-item-image">
                {recItem.image && recItem.image.trim() !== '' ? (
                  <img 
                    src={`${recItem.image}?v=${recItem.id}`} 
                    alt={recItem.name}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                    onLoad={() => {
                      // Успешная загрузка изображения
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="image-placeholder-small"
                  style={{ display: recItem.image && recItem.image.trim() !== '' ? 'none' : 'flex' }}
                >
                </div>
              </div>
              <div className="rec-item-info">
                <h4 className="rec-item-name">{recItem.name}</h4>
                <p className="rec-item-volume">{recItem.weight}</p>
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
          </>
        ) : isInCart && isButtonPressed ? (
          <>
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

      {/* Separate Back Button */}
      {(isInCart || isButtonPressed) && (
        <button 
          className="separate-back-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleBackToMenu();
          }}
        >
          ←
        </button>
      )}

      {/* Separate Cart Button */}
      {(isInCart || isButtonPressed) && (
        <button 
          className="separate-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleGoToCart();
          }}
        >
          🛒
        </button>
      )}
    </div>
  );
}; 