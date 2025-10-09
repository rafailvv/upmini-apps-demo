import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToGlobalCart, getGlobalCart, subscribeToCartUpdates, removeFromGlobalCart, updateGlobalCartItemWithData, updateCartItemCommentWithAddons } from './MenuList';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { getAddonsForItem, calculateAddonsPrice, getRecommendedItemsForItem, getTagsForItem, getCategories, type Addon, type MenuItem, type Tag, type Category } from '../utils/dataLoader';
import { saveTempItemData, getTempItemData, clearTempItemData } from '../utils/tempDataManager';

interface ItemDetailProps {
  item: MenuItem;
}

// Функция для склонения слова "Шт"
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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<number>(0); // индекс выбранной вариации
  const [currentVariationInCart, setCurrentVariationInCart] = useState<boolean>(false);
  const [currentVariationQuantity, setCurrentVariationQuantity] = useState<number>(0);

  const addons: Addon[] = getAddonsForItem(item.id);
  const recommendedItems: MenuItem[] = getRecommendedItemsForItem(item.id);
  const tags: Tag[] = getTagsForItem(item.id);
  const categories: Category[] = getCategories();

  // Функция для получения названия категории по ID
  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  // Получаем текущую цену с учетом выбранной вариации
  const getCurrentPrice = (): number => {
    if (item.variations && item.variations.length > 0) {
      return item.variations[selectedVariation]?.price || item.price;
    }
    return item.price;
  };

  // Функция для проверки, есть ли товар с текущей вариацией в корзине
  const checkCurrentVariationInCart = () => {
    const cart = getGlobalCart();
    const cartItem = cart.find(cartItem => 
      cartItem.id === item.id && 
      cartItem.selectedVariation === selectedVariation
    );
    console.log("Ищем товар с вариацией: ", cartItem);
    
    setCurrentVariationInCart(!!cartItem);
    setCurrentVariationQuantity(cartItem ? cartItem.quantity : 0);
  };

  // Обработчик выбора вариации
  const handleVariationSelect = (index: number) => {
    setSelectedVariation(index);
    
  };

  // Функция для обрезки текста
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Сброс состояния изображения при изменении товара
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [item.id]);

  // Предзагрузка изображения
  useEffect(() => {
    if (item.image && item.image.trim() !== '') {
      const img = new Image();
      img.src = `${item.image}?v=${item.id}`;
      img.onload = () => {
        setImageError(false);
        setImageLoading(false);
      };
      img.onerror = () => {
        setImageError(true);
        setImageLoading(false);
      };
    } else {
      setImageLoading(false);
    }
  }, [item.id, item.image]);

  // Отслеживаем изменения selectedVariation и проверяем корзину
  useEffect(() => {
    checkCurrentVariationInCart();
    
    // Если товара с выбранной вариацией нет в корзине, сбрасываем состояния
    if (!currentVariationInCart) {
      setIsInCart(false);
      setCartQuantity(0);
      setIsButtonPressed(false);
    } else {
      setIsInCart(true);
      setCartQuantity(currentVariationQuantity);
      setIsButtonPressed(true);
    }
  }, [selectedVariation, item.id, currentVariationInCart]);

  // Подписываемся на обновления корзины и избранного
  useEffect(() => {
    // Скролл наверх страницы при открытии
    window.scrollTo(0, 0);

    const unsubscribeCart = subscribeToCartUpdates(() => {
      const cart = getGlobalCart();
      // Ищем товар с учетом выбранной вариации
      const cartItem = cart.find(cartItem => 
        cartItem.id === item.id && 
        cartItem.selectedVariation === selectedVariation
      );
      setIsInCart(!!cartItem);
      setCartQuantity(cartItem ? cartItem.quantity : 0);
      
      // Загружаем сохраненные данные из корзины, но НЕ меняем selectedVariation
      if (cartItem) {
        setComment(cartItem.comment || '');
        setSelectedAddons(cartItem.selectedAddons || []);
        // НЕ меняем selectedVariation - оставляем текущую выбранную
        setIsButtonPressed(true);
      }
    });

    const unsubscribeFavorites = subscribeToFavoritesUpdates(() => {
      const favorites = getFavorites();
      setIsFavorite(!!favorites[item.id]);
    });
    
    // Инициализируем состояние корзины и избранного
    const cart = getGlobalCart();
    
    // Сначала ищем любую вариацию этого товара в корзине
    const anyCartItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (anyCartItem) {
      // Если есть товар в корзине, выбираем его вариацию
      setSelectedVariation(anyCartItem.selectedVariation || 0);
      setIsInCart(true);
      setCartQuantity(anyCartItem.quantity);
      setComment(anyCartItem.comment || '');
      setSelectedAddons(anyCartItem.selectedAddons || []);
      setIsButtonPressed(true);
    } else {
      // Если товара нет в корзине, загружаем временные данные
      const tempData = getTempItemData(item.id);
      if (tempData) {
        setComment(tempData.comment);
        setSelectedAddons(tempData.selectedAddons);
      } else {
        // Если нет временных данных, сбрасываем состояние
        setComment('');
        setSelectedAddons([]);
      }
      setIsButtonPressed(false);
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
    } else {
      // Если товара нет в корзине, сохраняем во временное хранилище
      saveTempItemData(item.id, newSelectedAddons, comment);
    }
  };

  const getTotalPrice = () => {
    const addonsPrice = calculateAddonsPrice(selectedAddons);
    return getCurrentPrice() + addonsPrice;
  };



  // Функция для работы с конкретной вариацией
  const handleVariationDecrease = () => {
    if (currentVariationQuantity === 1) {
      // Удаляем товар с конкретной вариацией (устанавливаем количество в 0)
      updateGlobalCartItemWithData(item.id, 0, comment || '', selectedAddons || [], selectedVariation);
      // Обновляем состояние
      setCurrentVariationQuantity(0);
      setCurrentVariationInCart(false);
    } else {
      // Уменьшаем количество
      updateGlobalCartItemWithData(item.id, currentVariationQuantity - 1, comment || '', selectedAddons || [], selectedVariation);
      setCurrentVariationQuantity(currentVariationQuantity - 1);
    }
  };

  const handleVariationIncrease = () => {
    addToGlobalCart(item, comment || '', selectedAddons || [], selectedVariation);
    // Обновляем состояние
    setCurrentVariationQuantity(currentVariationQuantity + 1);
    setCurrentVariationInCart(true);
  };

  const handleDecreaseQuantity = () => {
    if (cartQuantity === 1) {
      removeFromGlobalCart(item.id, selectedVariation);
      // Если удалили последний товар, возвращаемся к обычному состоянию
      setIsButtonPressed(false);
      setIsInCart(false);
      setCartQuantity(0);
      // Сохраняем текущие данные во временное хранилище
      saveTempItemData(item.id, selectedAddons, comment);
    } else {
      updateGlobalCartItemWithData(item.id, cartQuantity - 1, comment, selectedAddons, selectedVariation);
      // Обновляем состояние корзины сразу
      setCartQuantity(cartQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    addToGlobalCart(item, comment || '', selectedAddons || [], selectedVariation);
    // Обновляем состояние корзины сразу
    setCartQuantity(cartQuantity + 1);
  };

  const toggleFavorite = () => {
    toggleGlobalFavorite(item.id);
  };

  const handleButtonPress = () => {
    if (!isInCart && !currentVariationInCart) {
      // Сразу добавляем товар в корзину с выбранной вариацией
      addToGlobalCart(item, comment || '', selectedAddons || [], selectedVariation);
      // Очищаем временные данные, так как товар теперь в корзине
      clearTempItemData(item.id);
      // Показываем состояние pressed
      setIsButtonPressed(true);
      // Обновляем состояние корзины сразу
      setIsInCart(true);
      setCartQuantity(1);
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
        <h1 className="detail-title">{getCategoryLabel(item.category)}</h1>
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
              setImageError(false);
              setImageLoading(false);
            }}
            onError={(e) => {
              setImageError(true);
              setImageLoading(false);
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
          style={{ 
            display: (item.image && item.image.trim() !== '' && !imageError) ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}
        >
          {imageLoading ? 'Загрузка...' : 'Изображение недоступно'}
        </div>
      </div>

      {/* Item Info */}
      <div className="item-info-detail">
        <h2 className="item-name-detail">{item.name}</h2>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="item-tags">
            {tags.map((tag) => (
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
        )}

        <p className="item-description-detail">
          {item.description}
        </p>

        {/* Variations */}
        {item.variations && item.variations.length > 0 && (
          <div className="item-variations">
            <h4 className="variations-title">Размер</h4>
            <div className="variations-buttons">
              {item.variations.map((variation, index) => (
                <button
                  key={variation.id}
                  className={`variation-btn ${selectedVariation === index ? 'selected' : ''}`}
                  onClick={() => handleVariationSelect(index)}
                >
                  {variation.size}
                </button>
              ))}
            </div>
          </div>
        )}
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
            } else {
              // Если товара нет в корзине, сохраняем во временное хранилище
              saveTempItemData(item.id, selectedAddons, newComment);
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
                <p className="rec-item-description">{truncateText(recItem.description, 60)}</p>
              </div>
              <button className="rec-item-arrow">→</button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`bottom-action-bar ${isInCart ? 'active' : ''} ${isButtonPressed ? 'pressed' : ''} ${currentVariationInCart ? 'active pressed' : ''}`} onClick={!isInCart && !currentVariationInCart ? handleButtonPress : undefined}>
        {!isInCart && !isButtonPressed && !currentVariationInCart ? (
          <span className="total-price">В корзину – {getTotalPrice()} ₽</span>
        ) : currentVariationInCart ? (
          <>
            <button 
              className="quantity-btn minus"
              onClick={(e) => {
                e.stopPropagation();
                handleVariationDecrease();
              }}
            >
              {currentVariationQuantity === 1 ? (
                <span className="material-symbols-outlined">delete</span>
              ) : (
                '−'
              )}
            </button>
            <span className="total-price">{currentVariationQuantity} {getQuantityText(currentVariationQuantity)} – {getTotalPrice() * currentVariationQuantity} ₽</span>
            <button 
              className="quantity-btn plus"
              onClick={(e) => {
                e.stopPropagation();
                handleVariationIncrease();
              }}
            >
              +
            </button>
          </>
        ) : !isInCart && isButtonPressed && !currentVariationInCart ? (
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