
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus } from '../types';
import Card from '../components/Card';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">التقارير والإحصائيات</h1>
        <p className="mt-1 text-neutral-dark opacity-75">تحليل المبيعات والأداء العام للمطعم.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-r-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-dark opacity-70 font-medium mb-1">إجمالي الإيرادات</p>
              <p className="text-3xl font-extrabold text-neutral-dark">{totalRevenue.toFixed(2)} ر.س</p>
            </div>
            <DollarSign className="text-green-500 h-8 w-8" />
          </div>
        </Card>
        <Card className="p-6 border-r-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-dark opacity-70 font-medium mb-1">الطلبات المكتملة</p>
              <p className="text-3xl font-extrabold text-neutral-dark">{totalOrders}</p>
            </div>
            <Package className="text-blue-500 h-8 w-8" />
          </div>
        </Card>
        <Card className="p-6 border-r-4 border-accent">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-dark opacity-70 font-medium mb-1">متوسط قيمة الطلب</p>
              <p className="text-3xl font-extrabold text-neutral-dark">{averageOrderValue.toFixed(2)} ر.س</p>
            </div>
            <TrendingUp className="text-accent h-8 w-8" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6 text-neutral-dark">أكثر 5 أطباق مبيعاً (من حيث الكمية)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5Dishes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} قطعة`, 'الكمية']} labelStyle={{ color: '#000' }} />
              <Legend />
              <Bar dataKey="quantity" name="الكمية المباعة" fill="#C7A27C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
