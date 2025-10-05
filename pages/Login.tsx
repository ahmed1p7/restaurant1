import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UtensilsCrossed, LogIn, User } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const isAdminLogin = username.toLowerCase() === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('Invalid username or password.');
    }
  };

  const handleQuickLogin = () => {
    setError('');
    login('john');
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <UtensilsCrossed className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-dark">
            Culinary Command Center
          </h1>
          <p className="mt-2 text-sm text-neutral-dark opacity-75">Please sign in to continue</p>
        </div>
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-dark">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-neutral rounded-md shadow-sm placeholder-neutral-dark placeholder-opacity-60 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="e.g., admin or john"
                />
              </div>
            </div>

            {isAdminLogin && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-dark"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-neutral rounded-md shadow-sm placeholder-neutral-dark placeholder-opacity-60 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="password is 'admin'"
                  />
                </div>
              </div>
            )}
            
            {error && <p className="text-sm text-danger">{error}</p>}
            
            <div>
              <Button type="submit" className="w-full" Icon={LogIn}>
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-dark opacity-70">Or quick login as</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="secondary" className="w-full" Icon={User} onClick={handleQuickLogin}>
              Login as John (Waiter)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;