
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, BarChart2 } from 'lucide-react';
import Card from '../components/Card';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, dishes } = useRestaurantData();

  const activeOrders = orders.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS).length;
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.dish.price * item.quantity, 0), 0);

  const statCards = [
    { title: 'الطلبات النشطة', value: activeOrders, icon: ShoppingCart, color: 'text-drinks-primary' },
    { title: 'إجمالي أطباق المنيو', value: dishes.length, icon: BookOpen, color: 'text-green-600' },
    { title: 'إيرادات اليوم', value: `${totalRevenue.toFixed(2)} ر.س`, icon: BarChart2, color: 'text-accent' },
  ];

  const actionCards = [
    { title: 'إدارة المنيو', path: '/admin/menu', icon: BookOpen, description: 'أضف، عدل أو احذف أطباق من قائمة الطعام.' },
    { title: 'عرض كافة الطلبات', path: '/orders', icon: ShoppingCart, description: 'تتبع كافة الطلبات القادمة والمكتملة.' },
    { title: 'التقارير والإحصائيات', path: '/admin/reports', icon: BarChart2, description: 'تحليل المبيعات والأداء العام للمطعم.' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">لوحة التحكم</h1>
        <p className="mt-1 text-neutral-dark opacity-75">نظرة عامة على عمليات المطعم لهذا اليوم.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(stat => (
          <Card key={stat.title} className="p-6 flex items-center border-r-4 border-accent">
            <stat.icon className={`h-12 w-12 ml-4 ${stat.color}`} />
            <div>
              <p className="text-neutral-dark opacity-60 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-neutral-dark">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actionCards.map(action => (
          <Card key={action.title} className="p-6 flex flex-col items-start cursor-pointer hover:bg-muted group" onClick={() => navigate(action.path)}>
            <div className="flex items-center text-primary mb-3">
              <action.icon className="h-8 w-8 ml-3 text-accent group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold">{action.title}</h2>
            </div>
            <p className="text-neutral-dark opacity-75 flex-grow mb-4">{action.description}</p>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:underline">
              انتقل إلى {action.title} 
              <span className="transform rotate-180">←</span>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;