import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { initTelegramMiniApp, setupTelegramBackButton } from '../../../utils/telegramUtils';
import '../styles.css';

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
}

interface Category {
  id: string;
  name: string;
  label: string;
}

// Глобальное состояние корзины
let globalCart: CartItem[] = [];
let cartUpdateCallbacks: (() => void)[] = [];

export const addToGlobalCart = (item: MenuItem) => {
  const existingItem = globalCart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    globalCart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  // Уведомляем все компоненты об обновлении корзины
  cartUpdateCallbacks.forEach(callback => callback());
};

export const getGlobalCart = (): CartItem[] => {
  return [...globalCart];
};

export const clearGlobalCart = () => {
  globalCart = [];
  cartUpdateCallbacks.forEach(callback => callback());
};

export const updateGlobalCartItem = (itemId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    globalCart = globalCart.filter(item => item.id !== itemId);
  } else {
    globalCart = globalCart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
  }
  cartUpdateCallbacks.forEach(callback => callback());
};

export const removeFromGlobalCart = (itemId: number) => {
  globalCart = globalCart.filter(item => item.id !== itemId);
  cartUpdateCallbacks.forEach(callback => callback());
};

export const subscribeToCartUpdates = (callback: () => void) => {
  cartUpdateCallbacks.push(callback);
  return () => {
    cartUpdateCallbacks = cartUpdateCallbacks.filter(cb => cb !== callback);
  };
};

export const MenuList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('hits');
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [cartItems, setCartItems] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribe = subscribeToCartUpdates(() => {
      setCart(getGlobalCart());

      // Обновляем состояние кнопок добавления в корзину
      const newCartItems: { [key: number]: boolean } = {};
      globalCart.forEach(item => {
        if (item.quantity > 0) {
          newCartItems[item.id] = true;
        }
      });
      setCartItems(newCartItems);
    });

    // Инициализируем корзину
    setCart(getGlobalCart());

    // Инициализируем состояние кнопок
    const newCartItems: { [key: number]: boolean } = {};
    globalCart.forEach(item => {
      if (item.quantity > 0) {
        newCartItems[item.id] = true;
      }
    });
    setCartItems(newCartItems);

    return unsubscribe;
  }, []);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  const categories: Category[] = [
    { id: 'hits', name: 'hits', label: 'НАШИ ХИТЫ' },
    { id: 'main', name: 'main', label: 'ОСНОВНЫЕ БЛЮДА' },
    { id: 'appetizers', name: 'appetizers', label: 'ЗАКУСКИ' },
    { id: 'desserts', name: 'desserts', label: 'ДЕСЕРТЫ' },
    { id: 'drinks', name: 'drinks', label: 'НАПИТКИ' },
  ];

  const menuItems: MenuItem[] = [
    // НАШИ ХИТЫ
    {
      id: 1,
      name: 'Карбонара с грибами и сыром',
      weight: '300 г',
      description: 'Паста, бекон, куриные яйца, пармезан, специи',
      price: 500,
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА', 'ОСТРОЕ'],
      category: 'hits'
    },
    {
      id: 2,
      name: 'Карбонара с грибами и сыром',
      weight: '300 г',
      description: 'Паста, бекон, куриные яйца, пармезан, специи',
      price: 500,
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА', 'ОСТРОЕ'],
      category: 'hits'
    },
    {
      id: 3,
      name: 'Стейк из говядины',
      weight: '250 г',
      description: 'Говядина, овощи гриль, соус',
      price: 800,
      image: '/api/placeholder/300/200',
      tags: ['ПОПУЛЯРНОЕ'],
      category: 'hits'
    },
    {
      id: 4,
      name: 'Цезарь с курицей',
      weight: '280 г',
      description: 'Салат, курица, сухарики, соус цезарь',
      price: 350,
      image: '/api/placeholder/300/200',
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
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА', 'ОСТРОЕ'],
      category: 'main'
    },
    {
      id: 6,
      name: 'Карбонара с грибами и сыром',
      weight: '300 г',
      description: 'Паста, бекон, куриные яйца, пармезан, специи',
      price: 500,
      image: '/api/placeholder/300/200',
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
    },
    {
      id: 10,
      name: 'Ризотто с морепродуктами',
      weight: '280 г',
      description: 'Рис, креветки, мидии, пармезан, белое вино',
      price: 650,
      image: '/api/placeholder/300/200',
      tags: ['ПРЕМИУМ'],
      category: 'main'
    },

    // ЗАКУСКИ
    {
      id: 11,
      name: 'Брускетта с томатами',
      weight: '120 г',
      description: 'Хлеб, помидоры, базилик, оливковое масло',
      price: 180,
      image: '/api/placeholder/300/200',
      tags: ['ВЕГЕТАРИАНСКОЕ'],
      category: 'appetizers'
    },
    {
      id: 12,
      name: 'Карпаччо из говядины',
      weight: '150 г',
      description: 'Тонко нарезанная говядина, руккола, пармезан',
      price: 420,
      image: '/api/placeholder/300/200',
      tags: ['ПРЕМИУМ'],
      category: 'appetizers'
    },
    {
      id: 13,
      name: 'Сырная тарелка',
      weight: '200 г',
      description: 'Ассорти сыров, орехи, мед, крекеры',
      price: 380,
      image: '/api/placeholder/300/200',
      tags: ['ВЕГЕТАРИАНСКОЕ'],
      category: 'appetizers'
    },
    {
      id: 14,
      name: 'Кальмары в кляре',
      weight: '180 г',
      description: 'Кальмары, кляр, соус тартар',
      price: 320,
      image: '/api/placeholder/300/200',
      tags: ['МОРЕПРОДУКТЫ'],
      category: 'appetizers'
    },

    // ДЕСЕРТЫ
    {
      id: 15,
      name: 'Тирамису',
      weight: '150 г',
      description: 'Печенье савоярди, кофе, маскарпоне, какао',
      price: 280,
      image: '/api/placeholder/300/200',
      tags: ['КЛАССИКА'],
      category: 'desserts'
    },
    {
      id: 16,
      name: 'Чизкейк Нью-Йорк',
      weight: '180 г',
      description: 'Творожный сыр, песочная основа, ягодный соус',
      price: 320,
      image: '/api/placeholder/300/200',
      tags: ['ПОПУЛЯРНОЕ'],
      category: 'desserts'
    },
    {
      id: 17,
      name: 'Шоколадный фондан',
      weight: '120 г',
      description: 'Темный шоколад, ванильное мороженое',
      price: 250,
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА'],
      category: 'desserts'
    },
    {
      id: 18,
      name: 'Панакота с ягодами',
      weight: '140 г',
      description: 'Сливки, ваниль, свежие ягоды',
      price: 220,
      image: '/api/placeholder/300/200',
      tags: ['ЛЕГКОЕ'],
      category: 'desserts'
    },

    // НАПИТКИ
    {
      id: 19,
      name: 'Лимончелло',
      weight: '50 мл',
      description: 'Итальянский ликер из лимонов',
      price: 180,
      image: '/api/placeholder/300/200',
      tags: ['АЛКОГОЛЬ'],
      category: 'drinks'
    },
    {
      id: 20,
      name: 'Апероль Шприц',
      weight: '200 мл',
      description: 'Апероль, просекко, содовая, апельсин',
      price: 420,
      image: '/api/placeholder/300/200',
      tags: ['АЛКОГОЛЬ', 'ПОПУЛЯРНОЕ'],
      category: 'drinks'
    },
    {
      id: 21,
      name: 'Фреш из апельсинов',
      weight: '300 мл',
      description: 'Свежевыжатый апельсиновый сок',
      price: 150,
      image: '/api/placeholder/300/200',
      tags: ['БЕЗ АЛКОГОЛЯ'],
      category: 'drinks'
    },
    {
      id: 22,
      name: 'Латте с карамелью',
      weight: '350 мл',
      description: 'Эспрессо, молоко, карамельный сироп',
      price: 180,
      image: '/api/placeholder/300/200',
      tags: ['ГОРЯЧИЙ'],
      category: 'drinks'
    }
  ];

  const addToCart = (item: MenuItem) => {
    // Проверяем, есть ли уже товар в корзине
    const existingItem = globalCart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      // Если товар уже в корзине, убираем его
      updateGlobalCartItem(item.id, 0);
    } else {
      // Если товара нет в корзине, добавляем его
      addToGlobalCart(item);
    }
  };

  const handleItemClick = (itemId: number) => {
    navigate(`/miniapp/menu/item/${itemId}`);
  };

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Функция для удаления товара из корзины (пока не используется)
  // const removeFromCart = (itemId: number) => {
  //   setCart(prev => {
  //     const newCart = { ...prev };
  //     if (newCart[itemId] > 1) {
  //       newCart[itemId] -= 1;
  //     } else {
  //       delete newCart[itemId];
  //     }
  //     return newCart;
  //   });
  // };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Функция для скролла к секции
  const scrollToSection = (categoryId: string) => {
    console.log('Клик по категории:', categoryId);
    setSelectedCategory(categoryId);
    const section = sectionRefs.current[categoryId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Автоматическое переключение категории при скролле
  useEffect(() => {
    let scrollTimeout: number;

    const handleScroll = () => {
      if (!containerRef.current) return;

      // Очищаем предыдущий таймаут для дебаунсинга
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollTop = containerRef.current?.scrollTop || 0;
        const headerHeight = 60; // Высота хедера
        const navHeight = 60; // Высота навигации
        const totalOffset = headerHeight + navHeight;

        // Находим активную секцию
        let currentSection = '';

        categories.forEach(category => {
          const section = sectionRefs.current[category.id];
          if (section) {
            const sectionTop = section.offsetTop - totalOffset;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Проверяем, находится ли скролл в пределах секции
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
              currentSection = category.id;
            }
          }
        });

        // Если не нашли активную секцию, определяем ближайшую
        if (!currentSection) {
          let minDistance = Infinity;
          categories.forEach(category => {
            const section = sectionRefs.current[category.id];
            if (section) {
              const sectionTop = section.offsetTop - totalOffset;
              const distance = Math.abs(scrollTop - sectionTop);

              if (distance < minDistance) {
                minDistance = distance;
                currentSection = category.id;
              }
            }
          });
        }

        if (currentSection && currentSection !== selectedCategory) {
          setSelectedCategory(currentSection);
        }
      }, 50); // Небольшая задержка для плавности
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [categories, selectedCategory]);

  // Фильтруем товары по поисковому запросу
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Группируем элементы по категориям
  const groupedItems = categories.reduce((groups, category) => {
    const items = filteredItems.filter(item => item.category === category.id);
    if (items.length > 0) {
      groups[category.label] = items;
    }
    return groups;
  }, {} as { [key: string]: MenuItem[] });

  console.log('Текущая активная категория:', selectedCategory);

  return (
    <div className="menu-app" ref={containerRef}>
      <>
        <div
            className={`overlay ${isSidebarOpen ? '' : 'hidden'}`}
            onClick={() => setIsSidebarOpen(false)}
        />

        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`} id="sidebar">
          <div className="user-block">
            {(() => {
              const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
              // Telegram MiniApp API иногда возвращает поле photo_url
              const photoUrl = user?.photo_url;
              if (photoUrl) {
                return (
                    <img
                        src={photoUrl}
                        alt="Аватар пользователя"
                        className="sidebar-logo-large"
                    />
                );
              } else {
                return (
                    <div className="sidebar-logo-emoji">
                      😊
                    </div>
                );
              }
            })()}
            <span className="sidebar-username-large">
      {(() => {
        const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!user || (!user.first_name && !user.last_name)) {
          return 'Пользователь';
        }
        const { first_name, last_name } = user;
        return last_name
            ? `${first_name} ${last_name}`
            : first_name;
      })()}
    </span>
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li className="nav-item active">Меню</li>
              <li className="nav-item">Избранное</li>
              <li className="nav-item">Прошлые заказы</li>
            </ul>
          </nav>
        </div>
      </>
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
            <input
              type="text"
              placeholder="Поиск блюд..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
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

      {/* Categories */}
      <div className="categories-nav">
        <div className="categories-scroll">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => scrollToSection(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        {Object.entries(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([categoryName, items]) => {
            const categoryId = categories.find(cat => cat.label === categoryName)?.id || '';
            return (
              <div
                key={categoryName}
                className="menu-section"
                ref={(el) => {
                  sectionRefs.current[categoryId] = el;
                }}
              >
                <h2 className="section-title">{categoryName}</h2>
                <div className="menu-grid">
                  {items.map((item) => (
                    <div key={item.id} className="menu-item-card" onClick={() => handleItemClick(item.id)}>
                      <div className="item-image">
                        <div className="image-placeholder"></div>
                        <button
                          className={`favorite-btn ${favorites[item.id] ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                        >
                          {favorites[item.id] ? '❤️' : '🤍'}
                        </button>
                        <button
                          className={`add-to-cart-btn ${cartItems[item.id] ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          {cartItems[item.id] ? '✓' : '+'}
                        </button>
                      </div>

                      <div className="item-info">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-weight">{item.weight}</p>
                        <p className="item-description">{item.description}</p>
                        <div className="item-price">{item.price} ₽</div>

                        {item.tags.length > 0 && (
                          <div className="item-tags">
                            {item.tags.map((tag, index) => (
                              <span key={index} className={`tag tag-${tag.toLowerCase()}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : searchQuery ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поисковый запрос</p>
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              Очистить поиск
            </button>
          </div>
        ) : null}
      </div>

      {/* Floating Order Button */}
      {getTotalItems() > 0 && (
        <div className="floating-order-btn" onClick={() => navigate('/miniapp/menu/cart')}>
          <div className="order-info">
            <span className="order-total">{getTotalPrice()} ₽</span>
            <span className="order-text">- ЗАКАЗАТЬ</span>
          </div>
        </div>
      )}
    </div>
  );
}; 