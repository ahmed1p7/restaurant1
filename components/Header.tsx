import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = user?.role === Role.ADMIN ? [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/menu', label: 'Menu' },
    { path: '/orders', label: 'Orders' },
    { path: '/admin/reports', label: 'Reports' },
  ] : [
    { path: '/waiter', label: 'Tables' },
    { path: '/orders', label: 'Orders' },
  ];

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <UtensilsCrossed className="h-8 w-8 mr-3" />
            <span className="font-bold text-xl tracking-tight">Culinary Command</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-primary-dark' 
                    : 'hover:bg-primary-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center">
            <div className="mr-4 text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs capitalize text-neutral opacity-80">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark focus:ring-white"
              aria-label="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;