
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import { uiTranslations } from '../translations';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const lang = (localStorage.getItem('lang') as any) || 'ar';
  const t = uiTranslations[lang as keyof typeof uiTranslations];

  const navLinks = user?.role === Role.ADMIN ? [
    { path: '/admin', label: t.dashboard },
    { path: '/admin/menu', label: t.menu },
    { path: '/orders', label: t.orders },
    { path: '/admin/reports', label: t.reports },
  ] : [
    { path: '/waiter', label: t.tables },
    { path: '/orders', label: t.orderTracking },
  ];

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <UtensilsCrossed className="h-8 w-8 ml-3 text-accent" />
            <span className="font-bold text-xl tracking-tight">{t.appName}</span>
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
          <div className="flex items-center gap-4">
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs capitalize text-neutral opacity-80">
                {user?.role === Role.ADMIN ? t.admin : t.waiter}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={t.logout}
            >
              <LogOut className={`h-6 w-6 transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
