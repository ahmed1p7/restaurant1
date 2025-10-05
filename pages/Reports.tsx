import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus } from '../types';
import Card from '../components/Card';

const Reports: React.FC = () => {
  const { orders } = useRestaurantData();

  const completedOrders = useMemo(() => orders.filter(o => o.status === OrderStatus.COMPLETED), [orders]);

  const totalRevenue = useMemo(() => 
    completedOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.dish.price * item.quantity, 0), 0), 
    [completedOrders]
  );
  
  const totalOrders = completedOrders.length;
  
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const dishPerformance = useMemo(() => {
    const performance: { [key: string]: { name: string, quantity: number, revenue: number } } = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!performance[item.dish.id]) {
          performance[item.dish.id] = { name: item.dish.name, quantity: 0, revenue: 0 };
        }
        performance[item.dish.id].quantity += item.quantity;
        performance[item.dish.id].revenue += item.dish.price * item.quantity;
      });
    });
    return Object.values(performance).sort((a, b) => b.quantity - a.quantity);
  }, [completedOrders]);

  const top5Dishes = dishPerformance.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Reports</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Sales and performance analysis.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-neutral-dark opacity-70 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-neutral-dark">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-neutral-dark opacity-70 font-medium">Completed Orders</p>
          <p className="text-3xl font-bold text-neutral-dark">{totalOrders}</p>
        </Card>
        <Card className="p-6">
          <p className="text-neutral-dark opacity-70 font-medium">Average Order Value</p>
          <p className="text-3xl font-bold text-neutral-dark">${averageOrderValue.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Top 5 Best-Selling Dishes (by quantity)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5Dishes} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value}`} />
              <Legend />
              <Bar dataKey="quantity" fill="#8B2635" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Reports;