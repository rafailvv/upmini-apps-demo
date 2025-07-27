import React, { useState } from 'react';
import '../styles.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Карбонара с грибами и сыром',
      price: 500,
      quantity: 2,
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Стейк из говядины',
      price: 800,
      quantity: 1,
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Цезарь с курицей',
      price: 350,
      quantity: 1,
      image: '/api/placeholder/100/100'
    }
  ]);

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    name: '',
    comment: ''
  });

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return getTotalPrice() > 1000 ? 0 : 200;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const handleOrder = () => {
    // Здесь будет логика оформления заказа
    alert('Заказ оформлен!');
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Корзина</h2>
        <span className="items-count">{cartItems.length} товаров</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Корзина пуста</h3>
          <p>Добавьте блюда из меню, чтобы сделать заказ</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <div className="image-placeholder-small"></div>
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-price">{item.price} ₽</div>
                  
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  {item.price * item.quantity} ₽
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="delivery-section">
            <h3>Информация о доставке</h3>
            
            <div className="form-group">
              <label>Имя</label>
              <input
                type="text"
                value={deliveryInfo.name}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ваше имя"
              />
            </div>
            
            <div className="form-group">
              <label>Телефон</label>
              <input
                type="tel"
                value={deliveryInfo.phone}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            
            <div className="form-group">
              <label>Адрес доставки</label>
              <input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Улица, дом, квартира"
              />
            </div>
            
            <div className="form-group">
              <label>Комментарий к заказу</label>
              <textarea
                value={deliveryInfo.comment}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Дополнительные пожелания"
                rows={3}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Товары ({cartItems.length})</span>
              <span>{getTotalPrice()} ₽</span>
            </div>
            
            <div className="summary-row">
              <span>Доставка</span>
              <span>{getDeliveryFee() === 0 ? 'Бесплатно' : `${getDeliveryFee()} ₽`}</span>
            </div>
            
            <div className="summary-row total">
              <span>Итого</span>
              <span>{getFinalTotal()} ₽</span>
            </div>
          </div>

          {/* Order Button */}
          <button className="order-btn" onClick={handleOrder}>
            ОФОРМИТЬ ЗАКАЗ - {getFinalTotal()} ₽
          </button>
        </>
      )}
    </div>
  );
}; 