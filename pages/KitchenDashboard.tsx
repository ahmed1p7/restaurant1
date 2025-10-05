import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { Order, OrderItem, OrderStatus } from '../types';
import { UtensilsCrossed, Clock, MessageSquare, ChefHat, Check } from 'lucide-react';
import Button from '../components/Button';

interface KitchenDashboardProps {
  screenType: 'kitchen' | 'bar';
}

const OrderTimer: React.FC<{ startTime: Date }> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date().getTime() - startTime.getTime();
      const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setElapsed(`${minutes}:${seconds}`);
    };

    const intervalId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(intervalId);
  }, [startTime]);

  return <span className="font-mono font-semibold text-lg">{elapsed}</span>;
};


const KitchenOrderCard: React.FC<{ order: Order; onStatusChange: (orderId: string, status: OrderStatus) => void; }> = ({ order, onStatusChange }) => {
    const isNew = order.status === OrderStatus.NEW;
    const headerColor = isNew ? 'bg-drinks-primary text-white' : 'bg-kitchen-primary text-white';

    const handleStatusChange = () => {
        if (order.status === OrderStatus.NEW) {
            onStatusChange(order.id, OrderStatus.IN_PROGRESS);
        } else if (order.status === OrderStatus.IN_PROGRESS) {
            onStatusChange(order.id, OrderStatus.READY);
        }
    };
    
    const actionButtonText = isNew ? "Start Preparing" : "Mark as Ready";
    const ActionIcon = isNew ? ChefHat : Check;

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col h-full border-t-8" style={{borderColor: isNew ? '#0298C5' : '#F26C4F'}}>
            <div className={`p-3 ${headerColor} rounded-t-sm flex justify-between items-center`}>
                <h3 className="text-2xl font-bold">Table {order.tableId}</h3>
                <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <OrderTimer startTime={order.timestamp} />
                </div>
            </div>
            <ul className="p-4 space-y-3 flex-grow overflow-y-auto">
                {order.items.map((item, index) => (
                    <li key={index} className="border-b border-neutral pb-2">
                        <p className="text-xl font-semibold text-neutral-dark">
                            <span className="text-primary font-bold">{item.quantity}x</span> {item.dish.name}
                        </p>
                        {item.notes && (
                            <div className="mt-1 flex items-start text-sm text-neutral-dark/90 bg-muted rounded p-2">
                                <MessageSquare className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary opacity-80" />
                                <p className="italic">{item.notes}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="p-3 bg-muted rounded-b-lg">
                <Button onClick={handleStatusChange} className="w-full" Icon={ActionIcon}>
                    {actionButtonText}
                </Button>
            </div>
        </div>
    );
};


const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ screenType }) => {
    const { orders, updateOrderStatus } = useRestaurantData();
    const title = screenType === 'kitchen' ? 'Kitchen Display' : 'Bar Display';

    const relevantOrders = useMemo(() => {
        const activeOrders = orders.filter(
            o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS
        );

        const screenOrders = activeOrders.map(order => {
            const screenItems = order.items.filter(item => 
            screenType === 'kitchen' 
                ? item.dish.category !== 'Drinks' 
                : item.dish.category === 'Drinks'
            );
            return { ...order, items: screenItems };
        }).filter(order => order.items.length > 0);
        
        return screenOrders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [orders, screenType]);


    return (
        <div className="h-full flex flex-col">
            <header className="bg-neutral-dark text-white p-3 shadow-lg">
                <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                    <UtensilsCrossed size={28}/> {title}
                </h1>
            </header>
            {relevantOrders.length > 0 ? (
                <div className="flex-grow p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr overflow-y-auto">
                    {relevantOrders.map(order => (
                        <KitchenOrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <ChefHat size={64} className="mx-auto text-neutral-dark/30" />
                        <h2 className="mt-4 text-2xl font-semibold text-neutral-dark/80">No active orders</h2>
                        <p className="mt-1 text-neutral-dark/60">New orders will appear here automatically.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenDashboard;