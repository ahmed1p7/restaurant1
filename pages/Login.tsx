
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, User, KeyRound, Monitor, ChefHat, Coffee } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Login: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'waiter' | 'screens'>('waiter');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [screenLogin, setScreenLogin] = useState<'kitchen' | 'bar' | null>(null);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username || 'admin', password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center bg-primary-dark text-white">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-bold">ياقوت</h1>
          <p className="opacity-70">نظام إدارة المطاعم الذكي</p>
        </div>

        <div className="p-8">
          <div className="flex gap-2 mb-8 bg-muted p-1 rounded-lg">
            {(['admin', 'waiter', 'screens'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${role === r ? 'bg-primary text-white shadow' : 'text-neutral-dark opacity-60'}`}
              >
                {r === 'admin' ? 'مشرف' : r === 'waiter' ? 'نادل' : 'شاشات'}
              </button>
            ))}
          </div>

          {role !== 'screens' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute right-3 top-3 text-neutral-dark opacity-40" size={20} />
                <input
                  type="text"
                  placeholder={role === 'admin' ? 'اسم المستخدم' : 'رقم النادل'}
                  className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              {role === 'admin' && (
                <div className="relative">
                  <KeyRound className="absolute right-3 top-3 text-neutral-dark opacity-40" size={20} />
                  <input
                    type="password"
                    placeholder="كلمة المرور"
                    className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" className="w-full py-4 text-lg">تسجيل الدخول</Button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => login('kitchen', '111')} className="p-6 border-2 border-primary-light rounded-xl hover:bg-primary-light hover:text-white transition-all flex flex-col items-center gap-2">
                <ChefHat size={40} />
                <span className="font-bold">المطبخ</span>
              </button>
              <button onClick={() => login('bar', '222')} className="p-6 border-2 border-drinks-primary rounded-xl hover:bg-drinks-primary hover:text-white transition-all flex flex-col items-center gap-2">
                <Coffee size={40} />
                <span className="font-bold">المشروبات</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
