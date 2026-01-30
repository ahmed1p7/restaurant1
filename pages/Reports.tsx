
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus, type LocalizedString } from '../types';
import Card from '../components/Card';
import { TrendingUp, Package, DollarSign } from 'lucide-react';
import { uiTranslations } from '../translations';

const Reports: React.FC = () => {
  const { orders } = useRestaurantData();
  const lang = (localStorage.getItem('lang') as any) || 'ar';
  const t = uiTranslations[lang as keyof typeof uiTranslations];

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
          performance[item.dish.id] = { name: item.dish.name[lang as keyof LocalizedString], quantity: 0, revenue: 0 };
        }
        performance[item.dish.id].quantity += item.quantity;
        performance[item.dish.id].revenue += item.dish.price * item.quantity;
      });
    });
    return Object.values(performance).sort((a, b) => b.quantity - a.quantity);
  }, [completedOrders, lang]);

  const top5Dishes = dishPerformance.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={lang !== 'ar' ? 'text-left' : 'text-right'}>
        <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">{t.reports}</h1>
        <p className="mt-1 text-neutral-dark opacity-75 dark:text-gray-400">{t.reportsDesc}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`p-6 border-green-500 ${lang === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
          <div className={`flex justify-between items-start ${lang !== 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={lang !== 'ar' ? 'text-left' : 'text-right'}>
              <p className="text-neutral-dark opacity-70 dark:text-gray-400 font-medium mb-1">{t.statsRevenue}</p>
              <p className="text-3xl font-extrabold text-neutral-dark dark:text-white">{totalRevenue.toFixed(2)} {t.sar}</p>
            </div>
            <DollarSign className="text-green-500 h-8 w-8" />
          </div>
        </Card>
        <Card className={`p-6 border-blue-500 ${lang === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
          <div className={`flex justify-between items-start ${lang !== 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={lang !== 'ar' ? 'text-left' : 'text-right'}>
              <p className="text-neutral-dark opacity-70 dark:text-gray-400 font-medium mb-1">{t.statsCompleted}</p>
              <p className="text-3xl font-extrabold text-neutral-dark dark:text-white">{totalOrders}</p>
            </div>
            <Package className="text-blue-500 h-8 w-8" />
          </div>
        </Card>
        <Card className={`p-6 border-accent ${lang === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
          <div className={`flex justify-between items-start ${lang !== 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className={lang !== 'ar' ? 'text-left' : 'text-right'}>
              <p className="text-neutral-dark opacity-70 dark:text-gray-400 font-medium mb-1">{t.statsAvgOrder}</p>
              <p className="text-3xl font-extrabold text-neutral-dark dark:text-white">{averageOrderValue.toFixed(2)} {t.sar}</p>
            </div>
            <TrendingUp className="text-accent h-8 w-8" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className={`text-xl font-bold mb-6 text-neutral-dark dark:text-white ${lang !== 'ar' ? 'text-left' : 'text-right'}`}>{t.top5Title}</h2>
        <div className="h-80" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top5Dishes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} reversed={lang === 'ar'} />
              <YAxis orientation={lang === 'ar' ? 'right' : 'left'} />
              <Tooltip formatter={(value) => [`${value} ${t.piece}`, t.quantityLabel]} labelStyle={{ color: '#000' }} />
              <Legend />
              <Bar dataKey="quantity" name={t.soldQuantity} fill="#C7A27C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
