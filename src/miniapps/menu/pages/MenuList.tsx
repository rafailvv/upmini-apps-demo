import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { initTelegramMiniApp, setupTelegramBackButton, isTelegramMiniApp } from '../../../utils/telegramUtils';
import { getFavorites, subscribeToFavoritesUpdates, toggleFavorite as toggleGlobalFavorite } from '../utils/favoritesManager';
import { Sidebar } from '../components/Sidebar';
import { getCategories, getMenuItems, calculateAddonsPrice, getTagsForItem, type Category, type MenuItem } from '../utils/dataLoader';
import { clearAllTempData } from '../utils/tempDataManager';
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

// Глобальное состояние корзины
let globalCart: CartItem[] = [];
let cartUpdateCallbacks: (() => void)[] = [];

export const addToGlobalCart = (item: MenuItem, comment?: string, selectedAddons?: number[]) => {
  const existingItem = globalCart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    globalCart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      comment: comment || '',
      selectedAddons: selectedAddons || []
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

export const updateGlobalCartItemWithData = (itemId: number, newQuantity: number, comment?: string, selectedAddons?: number[]) => {
  if (newQuantity <= 0) {
    globalCart = globalCart.filter(item => item.id !== itemId);
  } else {
    globalCart = globalCart.map(item =>
      item.id === itemId ? { 
        ...item, 
        quantity: newQuantity,
        comment: comment !== undefined ? comment : item.comment,
        selectedAddons: selectedAddons !== undefined ? selectedAddons : item.selectedAddons
      } : item
    );
  }
  cartUpdateCallbacks.forEach(callback => callback());
};

export const removeFromGlobalCart = (itemId: number) => {
  globalCart = globalCart.filter(item => item.id !== itemId);
  cartUpdateCallbacks.forEach(callback => callback());
};

export const updateCartItemComment = (itemId: number, comment: string) => {
  globalCart = globalCart.map(item =>
    item.id === itemId ? { ...item, comment } : item
  );
  cartUpdateCallbacks.forEach(callback => callback());
};

export const updateCartItemCommentWithAddons = (itemId: number, comment: string, selectedAddons?: number[]) => {
  globalCart = globalCart.map(item =>
    item.id === itemId ? { 
      ...item, 
      comment,
      selectedAddons: selectedAddons !== undefined ? selectedAddons : item.selectedAddons
    } : item
  );
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
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const categoriesNavRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const lastScrollTop = useRef<number>(0);
  const lastCategoryChange = useRef<number>(0);
  const isManualClick = useRef<boolean>(false);

  // Создаем объект для быстрой проверки товаров в корзине
  const cartItemsMap = cart.reduce((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {} as { [key: number]: number });

  // Подписываемся на обновления корзины
  useEffect(() => {
    const unsubscribeCart = subscribeToCartUpdates(() => {
      setCart(getGlobalCart());


    });

    // Подписываемся на обновления избранного
    const unsubscribeFavorites = subscribeToFavoritesUpdates(() => {
      setFavorites(getFavorites());
    });

    // Инициализируем корзину
    setCart(getGlobalCart());

    // Инициализируем избранное
    setFavorites(getFavorites());



    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
    };
  }, []);

  // Инициализация Telegram MiniApp
  useEffect(() => {
    initTelegramMiniApp();
    setupTelegramBackButton();
  }, []);

  // Очистка временной памяти при загрузке главного меню
  useEffect(() => {
    clearAllTempData();
  }, []);

  const categories: Category[] = getCategories();
  const menuItems: MenuItem[] = getMenuItems();

  // Инициализация активной категории при загрузке
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Скролл к активной категории при изменении selectedCategory
  useEffect(() => {
    if (selectedCategory && categoriesNavRef.current && !isManualClick.current) {
      // Даем время на рендеринг
      setTimeout(() => {
        scrollToActiveCategory(selectedCategory);
      }, 100);
    }
    
    // Сбрасываем флаг ручного клика
    if (isManualClick.current) {
      setTimeout(() => {
        isManualClick.current = false;
      }, 200);
    }
  }, [selectedCategory]);

  // Принудительный скролл к активной категории после загрузки
  useEffect(() => {
    if (categories.length > 0 && categoriesNavRef.current) {
      setTimeout(() => {
        scrollToActiveCategory(selectedCategory);
      }, 500);
    }
  }, [categories]);

  // Функция для обрезки текста
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      // Если товар уже в корзине, удаляем его
      removeFromGlobalCart(item.id);
    } else {
      // Если товара нет в корзине, добавляем его
      addToGlobalCart(item);
    }
  };

  const handleItemClick = (itemId: number) => {
    navigate(`/miniapp/menu/item/${itemId}`);
  };

  const toggleFavorite = (itemId: number) => {
    toggleGlobalFavorite(itemId);
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
    return cart.reduce((total, item) => {
      const itemPriceWithAddons = getItemPriceWithAddons(item.id);
      return total + (itemPriceWithAddons * item.quantity);
    }, 0);
  };

  // Функция для расчета цены товара с добавками
  const getItemPriceWithAddons = (itemId: number) => {
    const cartItem = cart.find(item => item.id === itemId);
    if (!cartItem || !cartItem.selectedAddons || cartItem.selectedAddons.length === 0) {
      return menuItems.find(item => item.id === itemId)?.price || 0;
    }
    
    const basePrice = menuItems.find(item => item.id === itemId)?.price || 0;
    
    const addonsPrice = calculateAddonsPrice(cartItem.selectedAddons);
    
    return basePrice + addonsPrice;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Функция для скролла к секции
  const scrollToSection = (categoryId: string) => {
    console.log('Клик по категории:', categoryId);
    isManualClick.current = true; // Устанавливаем флаг ручного клика
    setSelectedCategory(categoryId);
    
    const section = sectionRefs.current[categoryId];
    if (section && containerRef.current) {
      // Определяем правильные отступы в зависимости от контекста
      const isTelegram = isTelegramMiniApp();
      
      let headerHeight = 60; // Высота хедера по умолчанию
      let navHeight = 60; // Высота навигации по умолчанию
      let additionalOffset = 10; // Дополнительный отступ
      
      if (isTelegram) {
        // В Telegram MiniApp используем другие отступы
        headerHeight = 90; // Высота хедера в Telegram
        navHeight = 60; // Высота навигации в Telegram
        additionalOffset = 70; // Уменьшаем отступ для позиционирования чуть ниже
      }
      
      const totalOffset = headerHeight + navHeight + additionalOffset;
      
      const sectionTop = section.offsetTop - totalOffset;
      containerRef.current.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  };

  // Функция для скролла к активной категории в горизонтальном списке
  const scrollToActiveCategory = (categoryId: string) => {
    if (!categoriesNavRef.current) return;
    
    const activeButton = categoriesNavRef.current.querySelector(`[data-category-id="${categoryId}"]`) as HTMLElement;
    if (!activeButton) return;

    const container = categoriesNavRef.current;
    
    // Проверяем, нужен ли скролл вообще
    if (container.scrollWidth <= container.clientWidth) {
      console.log('Скролл не нужен - контейнер помещается в видимую область');
      return;
    }
    
    // Вычисляем позицию кнопки относительно контейнера
    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;
    const containerWidth = container.clientWidth;
    
    // Центрируем кнопку в контейнере
    const targetScrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
    
    // Ограничиваем скролл границами контейнера
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
    
    console.log('Скролл к категории:', categoryId, {
      buttonLeft,
      buttonWidth,
      containerWidth,
      targetScrollLeft,
      maxScrollLeft,
      finalScrollLeft,
      currentScrollLeft: container.scrollLeft,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth
    });
    
    // Плавный скролл к активной категории
    activeButton.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  // Автоматическое переключение категории при скролле
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;

      // Отменяем предыдущий кадр анимации
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Используем requestAnimationFrame для плавного обновления
      animationFrameId = requestAnimationFrame(() => {
        const scrollTop = containerRef.current?.scrollTop || 0;
        const scrollDirection = scrollTop > lastScrollTop.current ? 'down' : 'up';
        lastScrollTop.current = scrollTop;
        
        // Определяем правильные отступы в зависимости от контекста
        const isTelegram = isTelegramMiniApp();
        
        let headerHeight = 60; // Высота хедера по умолчанию
        let navHeight = 60; // Высота навигации по умолчанию
        let additionalOffset = 20; // Дополнительный отступ
        
        if (isTelegram) {
          // В Telegram MiniApp используем другие отступы
          headerHeight = 90; // Высота хедера в Telegram
          navHeight = 60; // Высота навигации в Telegram
          additionalOffset = 80; // Уменьшаем отступ для позиционирования чуть ниже
        }
        
        const totalOffset = headerHeight + navHeight + additionalOffset;

        // Находим активную секцию
        let currentSection = '';
        let minDistance = Infinity;
        let bestSection = '';

        categories.forEach(category => {
          const section = sectionRefs.current[category.id];
          if (section) {
            const sectionTop = section.offsetTop - totalOffset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionCenter = sectionTop + (section.offsetHeight / 2);

            // Проверяем, находится ли скролл в пределах секции
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
              currentSection = category.id;
            }

            // Вычисляем расстояние до центра секции для определения ближайшей
            const distanceToCenter = Math.abs(scrollTop - sectionCenter);
            if (distanceToCenter < minDistance) {
              minDistance = distanceToCenter;
              bestSection = category.id;
            }

            // Дополнительная проверка: если секция видна в верхней части экрана
            const viewportHeight = window.innerHeight;
            const sectionVisibleTop = sectionTop;
            const sectionVisibleBottom = sectionTop + Math.min(section.offsetHeight, viewportHeight * 0.3);
            
            if (scrollTop >= sectionVisibleTop && scrollTop <= sectionVisibleBottom) {
              currentSection = category.id;
            }

            // Учитываем направление скролла для более точного определения
            if (scrollDirection === 'down' && scrollTop >= sectionTop && scrollTop < sectionTop + 100) {
              currentSection = category.id;
            } else if (scrollDirection === 'up' && scrollTop <= sectionBottom && scrollTop > sectionBottom - 100) {
              currentSection = category.id;
            }

            // Дополнительная логика для более быстрого переключения
            if (scrollTop >= sectionTop - 50 && scrollTop <= sectionBottom + 50) {
              if (!currentSection) {
                currentSection = category.id;
              }
            }
          }
        });

        // Если не нашли активную секцию в пределах секции, используем ближайшую
        if (!currentSection && bestSection) {
          currentSection = bestSection;
        }

        // Дополнительная логика для начала и конца списка
        if (scrollTop < 100 && categories.length > 0) {
          currentSection = categories[0].id;
        } else if (scrollTop > (containerRef.current?.scrollHeight || 0) - (containerRef.current?.clientHeight || 0) - 100 && categories.length > 0) {
          currentSection = categories[categories.length - 1].id;
        }

        const now = Date.now();
        const timeSinceLastChange = now - lastCategoryChange.current;
        
        if (currentSection && currentSection !== selectedCategory && timeSinceLastChange > 10) {
          console.log('Переключение на категорию:', currentSection, 'при скролле:', scrollTop, 'направление:', scrollDirection);
          setSelectedCategory(currentSection);
          lastCategoryChange.current = now;
          
          // Автоматически скроллим к активной категории
          setTimeout(() => {
            scrollToActiveCategory(currentSection);
          }, 100);
        } else if (!currentSection && categories.length > 0) {
          // Если не определили секцию, но есть категории, используем первую
          const firstCategory = categories[0];
          if (firstCategory && firstCategory.id !== selectedCategory && timeSinceLastChange > 10) {
            console.log('Используем первую категорию:', firstCategory.id);
            setSelectedCategory(firstCategory.id);
            lastCategoryChange.current = now;
            
            // Автоматически скроллим к активной категории
            setTimeout(() => {
              scrollToActiveCategory(firstCategory.id);
            }, 100);
          }
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [categories, selectedCategory]);

  // Фильтруем товары по поисковому запросу
  const filteredItems = menuItems.filter(item => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const itemTags = getTagsForItem(item.id);
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      itemTags.some(tag => tag.name.toLowerCase().includes(query))
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
    <div className="menu-app" ref={containerRef} style={{ height: '100vh', overflowY: 'auto' }}>
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
      <div className="categories-nav" ref={categoriesNavRef}>
        <div className="categories-scroll" ref={categoriesScrollRef}>
          {categories.map((category) => (
            <button
              key={category.id}
              data-category-id={category.id}
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
                          className="image-placeholder"
                          style={{ display: 'none' }}
                        >
                        </div>
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
                          className={`add-to-cart-btn ${cartItemsMap[item.id] ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          {cartItemsMap[item.id] ? '✓' : '+'}
                        </button>
                      </div>

                      <div className="item-info">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-weight">{item.weight}</p>
                        <p className="item-description">{truncateText(item.description, 80)}</p>
                        <div className="item-price">{item.price} ₽</div>

                        {item.tags.length > 0 && (
                          <div className="item-tags">
                            {getTagsForItem(item.id).map((tag) => (
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