import React from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import { Users, ShoppingCart, Package, DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardOverview: React.FC = () => {
  const { orders, dishes, tables } = useRestaurantData();
  
  // Calculate key metrics
  const activeOrders = orders.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.dish.price * item.quantity, 0), 0);

  // Prepare data for charts
  const orderStatusData = [
    { name: 'New', value: orders.filter(o => o.status === OrderStatus.NEW).length },
    { name: 'In Progress', value: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length },
    { name: 'Ready', value: orders.filter(o => o.status === OrderStatus.READY).length },
    { name: 'Completed', value: orders.filter(o => o.status === OrderStatus.COMPLETED).length },
    { name: 'Cancelled', value: orders.filter(o => o.status === OrderStatus.CANCELLED).length },
  ];

  const dishCategoryData = dishes.reduce((acc: { name: string; count: number }[], dish) => {
    const existingCategory = acc.find(cat => cat.name === dish.category);
    if (existingCategory) {
      existingCategory.count++;
    } else {
      acc.push({ name: dish.category, count: 1 });
    }
    return acc;
  }, []);

  // Sample daily revenue data for the bar chart
  const dailyRevenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1900 },
    { day: 'Wed', revenue: 1500 },
    { day: 'Thu', revenue: 1800 },
    { day: 'Fri', revenue: 2400 },
    { day: 'Sat', revenue: 2800 },
    { day: 'Sun', revenue: 2100 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Restaurant Dashboard</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Comprehensive overview of your restaurant operations.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <div>
            <p className="text-neutral-dark opacity-60 text-sm font-medium">Active Orders</p>
            <p className="text-3xl font-bold text-neutral-dark">{activeOrders}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <p className="text-neutral-dark opacity-60 text-sm font-medium">Today's Revenue</p>
            <p className="text-3xl font-bold text-neutral-dark">${totalRevenue.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-full bg-kitchen-primary/10 text-kitchen-primary mr-4">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <p className="text-neutral-dark opacity-60 text-sm font-medium">Occupied Tables</p>
            <p className="text-3xl font-bold text-neutral-dark">{occupiedTables}/{tables.length}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="p-3 rounded-full bg-drinks-primary/10 text-drinks-primary mr-4">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <p className="text-neutral-dark opacity-60 text-sm font-medium">Completed Orders</p>
            <p className="text-3xl font-bold text-neutral-dark">{completedOrders}</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Order Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Revenue */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Weekly Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyRevenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" fill="#8B2635" name="Daily Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dish Category Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Menu Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dishCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dishCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} dishes`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start border-b border-neutral/20 pb-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">New order placed</p>
                <p className="text-sm text-neutral-dark opacity-70">Table #3 ordered Margherita Pizza</p>
                <p className="text-xs text-neutral-dark opacity-50">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start border-b border-neutral/20 pb-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Reservation confirmed</p>
                <p className="text-sm text-neutral-dark opacity-70">Ahmed Hassan for 4 people at 7:30 PM</p>
                <p className="text-xs text-neutral-dark opacity-50">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start border-b border-neutral/20 pb-3">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Low stock alert</p>
                <p className="text-sm text-neutral-dark opacity-70">Only 2 kg of Mozzarella Cheese left</p>
                <p className="text-xs text-neutral-dark opacity-50">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Upcoming event</p>
                <p className="text-sm text-neutral-dark opacity-70">Birthday party for 8 people tomorrow</p>
                <p className="text-xs text-neutral-dark opacity-50">Scheduled for 7:00 PM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;