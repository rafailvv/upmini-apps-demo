import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGlobalCart, updateGlobalCartItem, subscribeToCartUpdates } from './MenuList';
import '../styles.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  addons?: string[];
}

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedTip, setSelectedTip] = useState<string>('');
  const [customTip, setCustomTip] = useState<string>('');

  // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      setCartItems(getGlobalCart());
    });
    
    // Инициализируем корзину
    setCartItems(getGlobalCart());
    
    return unsubscribe;
  }, []);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    updateGlobalCartItem(itemId, newQuantity);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    // Здесь будет логика оплаты
    console.log(`Оплата: ${type}, Сумма: ${getFinalTotal()} ₽`);
  };

  const handleOrder = () => {
    // Здесь будет логика оформления заказа
    console.log('Заказ оформлен!');
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
                <div className="item-details-new">
                  <div className="item-name-new">{item.name}</div>
                  <div className="item-price-new">{item.price} ₽</div>
                  {item.addons && item.addons.length > 0 && (
                    <div className="item-addons">
                      {item.addons.map((addon, index) => (
                        <div key={index} className="addon-item-new">
                          + {addon}
                        </div>
                      ))}
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
              className="payment-btn payment-full"
              onClick={() => handlePayment('full')}
            >
              Оплатить целиком
            </button>
            <button 
              className="payment-btn payment-split"
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
              className="pay-button"
              onClick={handleOrder}
            >
              К оплате
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 