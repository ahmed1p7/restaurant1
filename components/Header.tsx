
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = user?.role === Role.ADMIN ? [
    { path: '/admin', label: 'لوحة التحكم' },
    { path: '/admin/menu', label: 'المنيو' },
    { path: '/orders', label: 'الطلبات' },
    { path: '/admin/reports', label: 'التقارير' },
  ] : [
    { path: '/waiter', label: 'الطاولات' },
    { path: '/orders', label: 'متابعة الطلبات' },
  ];

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <UtensilsCrossed className="h-8 w-8 ml-3 text-accent" />
            <span className="font-bold text-xl tracking-tight">ياقوت</span>
          </div>
          <nav className="hidden md:flex items-center space-x-reverse space-x-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-primary-dark text-accent' 
                    : 'hover:bg-primary-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center">
            <div className="ml-4 text-left hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs capitalize text-neutral opacity-80">
                {user?.role === Role.ADMIN ? 'مشرف' : 'نادل'}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="h-6 w-6 transform rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;