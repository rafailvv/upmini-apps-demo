import React, { useState } from 'react';
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

interface Category {
  id: string;
  name: string;
  label: string;
}

export const MenuList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('hits');
  const [cart, setCart] = useState<{ [key: number]: number }>({
    1: 2, // 2 карбонары = 1000 ₽
    3: 1, // 1 карбонара = 500 ₽
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    { id: 'hits', name: 'hits', label: 'НАШИ ХИТЫ' },
    { id: 'main', name: 'main', label: 'ОСНОВНЫЕ БЛЮДА' },
    { id: 'appetizers', name: 'appetizers', label: 'ЗАКУСКИ' },
    { id: 'desserts', name: 'desserts', label: 'ДЕСЕРТЫ' },
    { id: 'drinks', name: 'drinks', label: 'НАПИТКИ' },
  ];

  const menuItems: MenuItem[] = [
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
      name: 'Карбонара с грибами и сыром',
      weight: '300 г',
      description: 'Паста, бекон, куриные яйца, пармезан, специи',
      price: 500,
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА', 'ОСТРОЕ'],
      category: 'main'
    },
    {
      id: 4,
      name: 'Карбонара с грибами и сыром',
      weight: '300 г',
      description: 'Паста, бекон, куриные яйца, пармезан, специи',
      price: 500,
      image: '/api/placeholder/300/200',
      tags: ['НОВИНКА', 'ОСТРОЕ'],
      category: 'main'
    },
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
    }
  ];

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = categories.find(cat => cat.id === item.category);
    const categoryName = category?.label || 'ДРУГИЕ';
    
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(item);
    return groups;
  }, {} as { [key: string]: MenuItem[] });

  return (
    <div className="menu-app">
      {/* Header */}
      <div className="menu-header">
        <div className="header-left">
          <button className="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
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
          <button className="cart-icon">
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
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-content">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName} className="menu-section">
            <h2 className="section-title">{categoryName}</h2>
            <div className="menu-grid">
              {items.map((item) => (
                <div key={item.id} className="menu-item-card">
                  <div className="item-image">
                    <div className="image-placeholder"></div>
                    <button className="favorite-btn">❤️</button>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item.id)}
                    >
                      +
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
        ))}
      </div>

      {/* Floating Order Button */}
      {getTotalItems() > 0 && (
        <div className="floating-order-btn">
          <div className="order-info">
            <span className="order-total">{getTotalPrice()} ₽</span>
            <span className="order-text">- ЗАКАЗАТЬ</span>
          </div>
        </div>
      )}
    </div>
  );
}; 