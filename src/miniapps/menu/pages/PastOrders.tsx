import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import { Sidebar } from '../components/Sidebar';
import { getGlobalCart, subscribeToCartUpdates } from './MenuList';
import { getPastOrders, type PastOrder } from '../utils/dataLoader';
import '../styles.css';

export const PastOrders: React.FC = () => {
  const navigate = useNavigate();
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PastOrder | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [closingOrderId, setClosingOrderId] = useState<string | null>(null);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      setCart(getGlobalCart());
    });
    
    // Инициализируем корзину
    setCart(getGlobalCart());
    
    return unsubscribe;
  }, []);

  // Загружаем данные о прошлых заказах
  useEffect(() => {
    const loadPastOrders = async () => {
      try {
        setLoading(true);
        const orders = await getPastOrders();
        setPastOrders(orders);
      } catch (error) {
        console.error('Ошибка загрузки прошлых заказов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPastOrders();
  }, []);

  const handleOrderClick = (order: PastOrder) => {
    if (expandedOrderId === order.id) {
      // Закрываем текущий заказ с анимацией
      setClosingOrderId(order.id);
      setTimeout(() => {
        setExpandedOrderId(null);
        setClosingOrderId(null);
      }, 500); // Время анимации закрытия
    } else {
      // Если есть открытый заказ, сначала плавно закрываем его
      if (expandedOrderId) {
        setClosingOrderId(expandedOrderId);
        // Ждем завершения анимации закрытия, затем открываем новый
        setTimeout(() => {
          setExpandedOrderId(null);
          setClosingOrderId(null);
          // Открываем новый заказ после закрытия предыдущего
          setTimeout(() => {
            setExpandedOrderId(order.id);
          }, 50);
        }, 500);
      } else {
        // Открываем новый заказ сразу
        setExpandedOrderId(order.id);
      }
    }
  };

  const formatPrice = (price: number) => {
    return `${price} ₽`;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Функция для отображения изображений блюд
  const renderOrderImages = (items: PastOrder['items']) => {
    const maxImages = 3;
    const visibleItems = items.slice(0, maxImages);
    const remainingCount = items.length - maxImages;

    return (
      <div className="order-images">
        {visibleItems.map((item, index) => (
          <div key={item.id} className="order-image-item">
            <img 
              src={item.image} 
              alt={item.name}
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
              style={{ display: 'none' }}
            >
              <span className="material-symbols-outlined">restaurant</span>
            </div>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="order-images-more">
            <span>+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="menu-app past-orders-page">
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
              Прошлые заказы
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

      <div className="menu-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка заказов...</p>
          </div>
        ) : pastOrders.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <h3>Нет прошлых заказов</h3>
            <p>Здесь будут отображаться ваши выполненные заказы</p>
          </div>
        ) : (
          <div className="past-orders-list">
            {pastOrders.map((order) => (
              <div key={order.id} className="past-order-container">
                <div 
                  className="past-order-item"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="order-date">
                    <span>{order.date}</span>
                  </div>
                  
                  <div className="order-content">
                    {renderOrderImages(order.items)}
                  </div>
                  
                  <div className="order-total-price">
                    {formatPrice(order.totalPrice)}
                  </div>
                </div>

                {/* Детали заказа */}
                {expandedOrderId === order.id && (
                  <div className={`order-details-expanded ${closingOrderId === order.id ? 'closing' : ''}`}>
                    <div className="order-items-list">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item-detail">
                          <div className="item-quantity-badge">
                            <span>{item.quantity}</span>
                          </div>
                          
                          <div className="cart-item-image">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="image-placeholder-small">
                                <span className="material-symbols-outlined">restaurant</span>
                              </div>
                            )}
                          </div>

                          <div className="item-details-new">
                            <div className="item-name-new">{item.name}</div>
                            
                            {item.addons && item.addons.length > 0 && (
                              <div className="item-addons">
                                {item.addons.map((addon, index) => (
                                  <div key={index} className="addon-item-new">+ {addon}</div>
                                ))}
                              </div>
                            )}
                            
                            {item.comment && (
                              <div className="item-comment">
                                <span className="comment-label">Комментарий:</span>
                                <span className="comment-text">{item.comment}</span>
                              </div>
                            )}
                          </div>

                          <div className="item-total">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 