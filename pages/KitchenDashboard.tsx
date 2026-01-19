
import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { Order, OrderStatus } from '../types';
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

  return <span className="font-mono font-bold text-xl">{elapsed}</span>;
};


const KitchenOrderCard: React.FC<{ order: Order; onStatusChange: (orderId: string, status: OrderStatus) => void; }> = ({ order, onStatusChange }) => {
    const isNew = order.status === OrderStatus.NEW;
    const headerColor = isNew ? 'bg-drinks-primary' : 'bg-kitchen-primary';

    const handleStatusChange = () => {
        if (order.status === OrderStatus.NEW) {
            onStatusChange(order.id, OrderStatus.IN_PROGRESS);
        } else if (order.status === OrderStatus.IN_PROGRESS) {
            onStatusChange(order.id, OrderStatus.READY);
        }
    };
    
    const actionButtonText = isNew ? "بدء التحضير" : "تجهيز الطلب";
    const ActionIcon = isNew ? ChefHat : Check;

    return (
        <div className="bg-white rounded-xl shadow-xl flex flex-col h-full overflow-hidden border-2 border-neutral/20 animate-fade-in">
            <div className={`p-4 ${headerColor} text-white flex justify-between items-center`}>
                <h3 className="text-3xl font-extrabold">طاولة {order.tableId}</h3>
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                    <Clock size={20} />
                    <OrderTimer startTime={order.timestamp} />
                </div>
            </div>
            <ul className="p-4 space-y-4 flex-grow overflow-y-auto bg-white">
                {order.items.map((item, index) => (
                    <li key={index} className="border-b border-neutral/50 pb-3 last:border-0">
                        <div className="flex justify-between items-start">
                            <p className="text-2xl font-bold text-neutral-dark">
                                <span className="text-accent ml-2">{item.quantity}x</span> {item.dish.name}
                            </p>
                        </div>
                        {item.notes && (
                            <div className="mt-2 flex items-start text-lg text-neutral-dark/80 bg-muted border-r-4 border-accent rounded p-3">
                                <MessageSquare className="h-5 w-5 ml-2 mt-1 flex-shrink-0 text-accent opacity-80" />
                                <p className="italic font-medium">{item.notes}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="p-4 bg-muted border-t border-neutral/30">
                <Button onClick={handleStatusChange} className="w-full !py-4 !text-xl font-bold" Icon={ActionIcon}>
                    {actionButtonText}
                </Button>
            </div>
        </div>
    );
};


const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ screenType }) => {
    const { orders, updateOrderStatus, screenSettings } = useRestaurantData();
    const title = screenType === 'kitchen' ? 'شاشة المطبخ الرئيسي' : 'شاشة قسم المشروبات';

    const relevantOrders = useMemo(() => {
        const activeOrders = orders.filter(
            o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS
        );

        const allowedCategories = screenType === 'kitchen' 
            ? screenSettings.kitchenCategories 
            : screenSettings.barCategories;

        const screenOrders = activeOrders.map(order => {
            const screenItems = order.items.filter(item => 
                allowedCategories.includes(item.dish.category)
            );
            return { ...order, items: screenItems };
        }).filter(order => order.items.length > 0);
        
        return screenOrders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [orders, screenType, screenSettings]);


    return (
        <div className="h-full flex flex-col bg-secondary">
            <header className="bg-primary text-white p-4 shadow-xl">
                <h1 className="text-4xl font-extrabold text-center flex items-center justify-center gap-4">
                    <UtensilsCrossed size={36} className="text-accent" /> {title}
                </h1>
            </header>
            {relevantOrders.length > 0 ? (
                <div className="flex-grow p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr overflow-y-auto">
                    {relevantOrders.map(order => (
                        <KitchenOrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <ChefHat size={120} className="mx-auto text-neutral opacity-20" />
                        <h2 className="mt-6 text-3xl font-bold text-neutral-dark opacity-40">لا توجد طلبات نشطة حالياً</h2>
                        <p className="mt-2 text-xl text-neutral-dark opacity-30">سيتم ظهور الطلبات الجديدة هنا تلقائياً.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenDashboard;
