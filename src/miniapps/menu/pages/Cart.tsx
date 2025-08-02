import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGlobalCart, updateGlobalCartItem, subscribeToCartUpdates } from './MenuList';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import { getAddon, calculateAddonsPrice, getAddonNames } from '../utils/addonsManager';
import '../styles.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  addons?: string[];
  image?: string;
  comment?: string;
  selectedAddons?: number[];
}

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedTip, setSelectedTip] = useState<string>('');
  const [customTip, setCustomTip] = useState<string>('');
  const [selectedPaymentType, setSelectedPaymentType] = useState<'full' | 'split' | null>(null);

  // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      setCartItems(getGlobalCart());
    });
    
    // Инициализируем корзину
    setCartItems(getGlobalCart());
    
    return unsubscribe;
  }, []);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    updateGlobalCartItem(itemId, newQuantity);
  };

  // Функция для расчета цены товара с добавками
  const getItemPriceWithAddons = (item: CartItem) => {
    let totalPrice = item.price;
    
    // Если есть selectedAddons, рассчитываем цену добавок
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const addonsPrice = calculateAddonsPrice(item.selectedAddons);
      
      totalPrice += addonsPrice;
    }
    
    return totalPrice;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPriceWithAddons = getItemPriceWithAddons(item);
      return total + (itemPriceWithAddons * item.quantity);
    }, 0);
  };

  const getTipAmount = () => {
    if (selectedTip === 'custom' && customTip) {
      return parseFloat(customTip) || 0;
    }
    if (selectedTip && selectedTip !== 'custom') {
      const tipPercent = parseFloat(selectedTip);
      return (getTotalPrice() * tipPercent) / 100;
    }
    return 0;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getTipAmount();
  };

  const handlePayment = (type: 'full' | 'split') => {
    setSelectedPaymentType(type);
    // Здесь будет логика оплаты
    console.log(`Оплата: ${type}, Сумма: ${getFinalTotal()} ₽`);
  };

  const handleOrder = () => {
    // Здесь будет логика оформления заказа
    console.log('Заказ оформлен!');
    alert('Ожидайте, с вами свяжется менеджер');
  };

  return (
    <div className="cart-page-new">
      {/* Bill Summary Section */}
      <div className="bill-summary">
        <div className="total-header">
          <h2 className="total-title">Итого</h2>
          <span className="total-amount">{getTotalPrice()} ₽</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-new">
            <div className="empty-cart-icon">🛒</div>
            <h3>Корзина пуста</h3>
            <p>Добавьте блюда из меню, чтобы сделать заказ</p>
            <button 
              className="back-to-menu-btn"
              onClick={() => navigate('/miniapp/menu')}
            >
              Перейти в меню
            </button>
          </div>
        ) : (
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-new">
                <div className="item-quantity-badge">
                  <span>{item.quantity}</span>
                </div>
                {item.image && (
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div 
                      className="image-placeholder-small"
                      style={{ display: 'none', width: '50px', height: '50px', borderRadius: '8px' }}
                    >
                    </div>
                  </div>
                )}
                <div className="item-details-new">
                  <div className="item-name-new">{item.name}</div>
                  <div className="item-price-new">{getItemPriceWithAddons(item)} ₽</div>
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <div className="item-addons">
                      {item.selectedAddons.map((addonId) => {
                        const addon = getAddon(addonId);
                        return addon ? (
                          <div key={addonId} className="addon-item-new">
                            + {addon.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  {item.comment && item.comment.trim() !== '' && (
                    <div className="item-comment">
                      <span className="comment-label">Комментарий:</span>
                      <span className="comment-text">{item.comment}</span>
                    </div>
                  )}
                </div>
                <div className="item-controls">
                  <button 
                    className="quantity-control-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <button 
                    className="quantity-control-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Options */}
      {cartItems.length > 0 && (
        <>
          <div className="payment-options">
            <button 
              className={`payment-btn payment-full ${selectedPaymentType === 'full' ? 'active' : ''}`}
              onClick={() => handlePayment('full')}
            >
              Оплатить целиком
            </button>
            <button 
              className={`payment-btn payment-split ${selectedPaymentType === 'split' ? 'active' : ''}`}
              onClick={() => handlePayment('split')}
            >
              Разделить на компанию
            </button>
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <h3 className="tips-title">Чаевые</h3>
            <div className="tips-buttons">
              <button 
                className={`tip-btn ${selectedTip === '5' ? 'active' : ''}`}
                onClick={() => setSelectedTip('5')}
              >
                5%
              </button>
              <button 
                className={`tip-btn ${selectedTip === '10' ? 'active' : ''}`}
                onClick={() => setSelectedTip('10')}
              >
                10%
              </button>
              <button 
                className={`tip-btn ${selectedTip === '15' ? 'active' : ''}`}
                onClick={() => setSelectedTip('15')}
              >
                15%
              </button>
              <button 
                className={`tip-btn ${selectedTip === 'custom' ? 'active' : ''}`}
                onClick={() => setSelectedTip('custom')}
              >
                Своя сумма
              </button>
            </div>
            {selectedTip === 'custom' && (
              <div className="custom-tip-input">
                <input
                  type="number"
                  placeholder="Введите сумму"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="tip-input"
                />
                <span className="tip-currency">₽</span>
              </div>
            )}
          </div>

          {/* Final Payment Button */}
          <div className="final-payment">
            <button 
              className="back-to-menu-btn"
              onClick={() => navigate('/miniapp/menu')}
            >
              Вернуться в меню
            </button>
            <button 
              className="pay-button"
              onClick={handleOrder}
            >
              Отправить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 