
import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

export const useRestaurantData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useRestaurantData must be used within a DataProvider');
  }
  return context;
};
