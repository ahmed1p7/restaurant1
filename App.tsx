
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import KitchenDashboard from './pages/KitchenDashboard';
import MenuManagement from './pages/MenuManagement';
import StaffManagement from './pages/StaffManagement'; // المكون الجديد
import OrderTracking from './pages/OrderTracking';
import OrderCreation from './pages/OrderCreation';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Main />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {user && ![Role.KITCHEN, Role.BAR].includes(user.role) && <Header />}
      <main className={`flex-grow ${user && [Role.KITCHEN, Role.BAR].includes(user.role) ? 'p-0' : 'p-4 md:p-6 lg:p-8'}`}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route path="/" element={
              !user ? <Navigate to="/login" /> : (
                user.role === Role.ADMIN ? <Navigate to="/admin" /> :
                user.role === Role.WAITER ? <Navigate to="/waiter" /> :
                user.role === Role.KITCHEN ? <Navigate to="/kitchen" /> :
                user.role === Role.BAR ? <Navigate to="/bar" /> :
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route path="/admin" element={<ProtectedRoute role={Role.ADMIN}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute role={Role.ADMIN}><MenuManagement /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute role={Role.ADMIN}><StaffManagement /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role={Role.ADMIN}><Reports /></ProtectedRoute>} />
          
          <Route path="/waiter" element={<ProtectedRoute role={Role.WAITER}><WaiterDashboard /></ProtectedRoute>} />
          <Route path="/waiter/order/:tableId" element={<ProtectedRoute role={Role.WAITER}><OrderCreation /></ProtectedRoute>} />
          
          <Route path="/orders" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          
          <Route path="/kitchen" element={<ProtectedRoute role={Role.KITCHEN}><KitchenDashboard screenType="kitchen" /></ProtectedRoute>} />
          <Route path="/bar" element={<ProtectedRoute role={Role.BAR}><KitchenDashboard screenType="bar" /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: Role;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default App;
