
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <AlertTriangle className="h-20 w-20 text-accent mb-6 animate-pulse" />
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-dark mb-4">الصفحة غير موجودة</h2>
      <p className="text-neutral-dark opacity-70 mb-8 max-w-md">
        عذراً، يبدو أن الصفحة التي تحاول الوصول إليها قد تم نقلها أو أنها لم تعد موجودة.
      </p>
      <Link to="/">
        <Button className="px-8 py-3 text-lg">العودة للرئيسية</Button>
      </Link>
    </div>
  );
};

export default NotFound;