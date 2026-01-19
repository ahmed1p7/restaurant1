import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, BarChart2, User, Calendar, Users } from 'lucide-react';
import Card from '../components/Card';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, dishes, tables } = useRestaurantData();

  const activeOrders = orders.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS).length;
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.dish.price * item.quantity, 0), 0);

  const statCards = [
    { title: 'Active Orders', value: activeOrders, icon: ShoppingCart, color: 'text-drinks-primary' },
    { title: 'Total Menu Items', value: dishes.length, icon: BookOpen, color: 'text-green-600' },
    { title: 'Today\'s Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: BarChart2, color: 'text-accent' },
  ];

  const actionCards = [
    { title: 'Manage Menu', path: '/admin/menu', icon: BookOpen, description: 'Add, edit, or remove dishes from the menu.' },
    { title: 'Manage Inventory', path: '/admin/inventory', icon: ShoppingCart, description: 'Track ingredients and manage stock levels.' },
    { title: 'Manage Customers', path: '/admin/customers', icon: User, description: 'Manage customer profiles and preferences.' },
    { title: 'Manage Staff', path: '/admin/staff', icon: Users, description: 'Manage employee information and schedules.' },
    { title: 'Manage Reservations', path: '/admin/reservations', icon: Calendar, description: 'Handle table reservations and bookings.' },
    { title: 'View All Orders', path: '/orders', icon: ShoppingCart, description: 'Track all incoming and completed orders.' },
    { title: 'View Reports', path: '/admin/reports', icon: BarChart2, description: 'Analyze sales and performance data.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Admin Dashboard</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Overview of your restaurant's operations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(stat => (
          <Card key={stat.title} className="p-6 flex items-center">
            <stat.icon className={`h-12 w-12 mr-4 ${stat.color}`} />
            <div>
              <p className="text-neutral-dark opacity-60 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-neutral-dark">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actionCards.map(action => (
          <Card key={action.title} className="p-6 flex flex-col items-start cursor-pointer hover:bg-muted" onClick={() => navigate(action.path)}>
            <div className="flex items-center text-primary">
              <action.icon className="h-8 w-8 mr-3" />
              <h2 className="text-xl font-semibold">{action.title}</h2>
            </div>
            <p className="mt-2 text-neutral-dark opacity-75 flex-grow">{action.description}</p>
            <span className="mt-4 text-sm font-medium text-primary hover:text-primary-dark">Go to {action.title} &rarr;</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;