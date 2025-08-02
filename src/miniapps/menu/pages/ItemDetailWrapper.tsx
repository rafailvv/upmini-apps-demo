import React from 'react';
import { useParams } from 'react-router-dom';
import { ItemDetail } from './ItemDetail';

// Данные о блюдах (в реальном приложении это будет API)
const menuItems = [
  {
    id: 1,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'hits'
  },
  {
    id: 2,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'hits'
  },
  {
    id: 3,
    name: 'Стейк из говядины',
    weight: '250 г',
    description: 'Говядина, овощи гриль, соус',
    price: 800,
    image: '/images/carbonara.jpg',
    tags: ['ПОПУЛЯРНОЕ'],
    category: 'hits'
  },
  {
    id: 4,
    name: 'Цезарь с курицей',
    weight: '280 г',
    description: 'Салат, курица, сухарики, соус цезарь',
    price: 350,
    image: '/images/carbonara.jpg',
    tags: ['ЛЕГКОЕ'],
    category: 'hits'
  },
  {
    id: 5,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 6,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/images/carbonara.jpg',
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
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 10,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 11,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 12,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'main'
  },
  {
    id: 13,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 14,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 15,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 16,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 17,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 18,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'appetizers'
  },
  {
    id: 19,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 20,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 21,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 22,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 23,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 24,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'desserts'
  },
  {
    id: 25,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  },
  {
    id: 26,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  },
  {
    id: 27,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  },
  {
    id: 28,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  },
  {
    id: 29,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  },
  {
    id: 30,
    name: 'Карбонара с грибами и сыром',
    weight: '300 г',
    description: 'Паста, бекон, куриные яйца, пармезан, специи',
    price: 500,
    image: '/api/placeholder/300/200',
    tags: ['НОВИНКА', 'ОСТРОЕ'],
    category: 'drinks'
  }
];

export const ItemDetailWrapper: React.FC = () => {
  const { itemId } = useParams();
  const item = menuItems.find(item => item.id === parseInt(itemId || '0'));

  if (!item) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'white',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Блюдо не найдено</h2>
          <p>Запрашиваемое блюдо не существует</p>
        </div>
      </div>
    );
  }

  return <ItemDetail item={item} />;
}; 