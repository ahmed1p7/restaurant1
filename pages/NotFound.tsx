import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold text-neutral-dark mb-2">404 - Page Not Found</h1>
      <p className="text-neutral-dark opacity-75 mb-6">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button>Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFound;