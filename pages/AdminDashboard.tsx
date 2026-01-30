
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, BarChart2, Users } from 'lucide-react';
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
    { title: 'إدارة الطاقم', path: '/admin/staff', icon: Users, description: 'إدارة الموظفين والرموز السرية والصلاحيات.' },
    { title: 'عرض كافة الطلبات', path: '/orders', icon: ShoppingCart, description: 'تتبع كافة الطلبات القادمة والمكتملة.' },
    { title: 'التقارير والإحصائيات', path: '/admin/reports', icon: BarChart2, description: 'تحليل المبيعات والأداء العام للمطعم.' },
  ];

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">لوحة التحكم</h1>
        <p className="mt-1 text-neutral-dark/40 font-bold">نظرة عامة على عمليات المطعم لهذا اليوم.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(stat => (
          <Card key={stat.title} className="p-8 flex items-center border-r-8 border-accent">
            <stat.icon className={`h-14 w-14 ml-6 ${stat.color}`} />
            <div>
              <p className="text-neutral-dark opacity-40 text-xs font-black uppercase tracking-widest">{stat.title}</p>
              <p className="text-4xl font-black text-primary-dark">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actionCards.map(action => (
          <Card key={action.title} className="p-8 flex flex-col items-start cursor-pointer hover:bg-primary-dark group transition-all duration-500 rounded-[2.5rem]" onClick={() => navigate(action.path)}>
            <div className="flex items-center text-primary mb-4 group-hover:text-accent">
              <action.icon className="h-10 w-10 ml-4 text-accent group-hover:scale-125 transition-transform duration-500" />
              <h2 className="text-2xl font-black group-hover:text-white">{action.title}</h2>
            </div>
            <p className="text-neutral-dark opacity-60 flex-grow mb-6 font-bold group-hover:text-white/60">{action.description}</p>
            <span className="text-xs font-black text-accent flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                انتقل الآن 
                <span className="transform rotate-180">←</span>
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
