import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Table } from '../types';
import { TableStatus } from '../types';
import Card from '../components/Card';
import { Utensils, Users } from 'lucide-react';

const TableCard: React.FC<{ table: Table }> = ({ table }) => {
    const navigate = useNavigate();
    const isAvailable = table.status === TableStatus.AVAILABLE;

    const statusClasses = isAvailable
      ? 'bg-green-100 border-green-500 text-green-700'
      : 'bg-kitchen-light border-kitchen-primary text-kitchen-primary';
    
    const cardClasses = isAvailable
        ? 'border-green-300 hover:border-green-500 hover:shadow-lg'
        : 'border-kitchen-primary/50';
    
    const handleClick = () => {
        if (isAvailable) {
            navigate(`/waiter/order/${table.id}`);
        }
    };

    return (
        <Card className={`p-4 border-2 ${cardClasses} ${isAvailable ? 'cursor-pointer' : ''}`} onClick={handleClick}>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-neutral-dark flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    Table {table.id}
                </h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                    {table.status}
                </span>
            </div>
            <div className="mt-4 flex items-center text-neutral-dark opacity-70">
                <Users className="mr-2 h-4 w-4" />
                <span>Seats: {table.capacity}</span>
            </div>
        </Card>
    );
};


const WaiterDashboard: React.FC = () => {
  const { tables } = useRestaurantData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Tables Overview</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Select an available table to create a new order.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {tables.sort((a,b) => a.id - b.id).map(table => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
};

export default WaiterDashboard;