import React from 'react';
import { useParams } from 'react-router-dom';
import { ItemDetail } from './ItemDetail';
import { getMenuItemById } from '../utils/dataLoader';

export const ItemDetailWrapper: React.FC = () => {
  const { itemId } = useParams();
  const item = getMenuItemById(parseInt(itemId || '0'));

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

  return <ItemDetail key={itemId} item={item} />;
}; 