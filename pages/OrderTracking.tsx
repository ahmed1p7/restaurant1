
import React, { useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Order, LocalizedString } from '../types';
import { OrderStatus, Role } from '../types';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { MessageSquare, Clock } from 'lucide-react';
import { uiTranslations } from '../translations';

const OrderCard: React.FC<{ order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ order, onStatusChange }) => {
    const { user } = useAuth();
    const lang = (localStorage.getItem('lang') as any) || 'ar';
    const t = uiTranslations[lang as keyof typeof uiTranslations];
    const total = order.items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

    const getNextStatus = (current: OrderStatus): OrderStatus | null => {
        switch(current) {
            case OrderStatus.NEW: return OrderStatus.IN_PROGRESS;
            case OrderStatus.IN_PROGRESS: return OrderStatus.READY;
            case OrderStatus.READY: return OrderStatus.COMPLETED;
            default: return null;
        }
    };

    const nextStatus = getNextStatus(order.status);
    
    const getStatusLabel = (status: OrderStatus) => {
        switch(status) {
            case OrderStatus.NEW: return t.statusNew;
            case OrderStatus.IN_PROGRESS: return t.statusInProgress;
            case OrderStatus.READY: return t.statusReady;
            case OrderStatus.COMPLETED: return t.statusCompleted;
            default: return status;
        }
    }

    return (
        <Card className="p-4 flex flex-col justify-between border-t-4 border-accent animate-fade-in">
            <div className="text-right">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg dark:text-white">{t.table} {order.tableId}</h3>
                    <div className="flex items-center gap-1 text-xs text-neutral-dark opacity-60 dark:text-gray-400">
                        <Clock size={12}/>
                        <span>{order.id.split('-')[1].slice(-4)}</span>
                    </div>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                    {order.items.map((item, index) => (
                        <li key={index} className="border-b border-neutral/30 dark:border-gray-700 pb-1">
                            <div className="flex justify-between font-medium dark:text-gray-200">
                                <span>{item.quantity}x {item.dish.name[lang as keyof LocalizedString]}</span>
                                <span>{(item.dish.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.notes && (
                                <div className="mt-1 flex items-start text-xs text-neutral-dark opacity-90 bg-muted dark:bg-gray-800 rounded p-1.5 dark:text-gray-400">
                                    <MessageSquare className={`h-3 w-3 ${lang === 'ar' ? 'ml-1' : 'mr-1'} flex-shrink-0 text-accent opacity-70`} />
                                    <p className="italic leading-tight">{item.notes}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="pt-2 flex justify-between font-bold text-primary dark:text-accent">
                    <span>{t.total}</span>
                    <span>{total.toFixed(2)} {lang === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
            </div>
            {user?.role === Role.WAITER && nextStatus && (
                <Button className="w-full mt-4" onClick={() => onStatusChange(order.id, nextStatus)}>
                    {t.moveTo}: {getStatusLabel(nextStatus)}
                </Button>
            )}
        </Card>
    );
};


const OrderColumn: React.FC<{ title: OrderStatus; orders: Order[]; onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ title, orders, onStatusChange }) => {
    const lang = (localStorage.getItem('lang') as any) || 'ar';
    const t = uiTranslations[lang as keyof typeof uiTranslations];

    const statusColors = {
        [OrderStatus.NEW]: 'bg-drinks-light/50 border-drinks-primary dark:bg-blue-900/20',
        [OrderStatus.IN_PROGRESS]: 'bg-kitchen-light/50 border-kitchen-primary dark:bg-orange-900/20',
        [OrderStatus.READY]: 'bg-green-50 border-green-500 dark:bg-green-900/20',
        [OrderStatus.COMPLETED]: 'bg-muted border-neutral-dark dark:bg-gray-800',
        [OrderStatus.CANCELLED]: 'bg-red-50 border-danger dark:bg-red-900/20'
    };

    const statusLabels = {
        [OrderStatus.NEW]: t.statusNew,
        [OrderStatus.IN_PROGRESS]: t.statusInProgress,
        [OrderStatus.READY]: t.readyToServe,
        [OrderStatus.COMPLETED]: t.statusCompleted,
        [OrderStatus.CANCELLED]: t.statusCancelled
    };

    return (
        <div className={`${statusColors[title]} rounded-lg p-4 border-t-8 h-full min-h-[500px]`}>
            <h2 className="text-xl font-bold mb-4 text-neutral-dark dark:text-white border-b border-neutral dark:border-gray-700 pb-2 text-right">
                {statusLabels[title]} ({orders.length})
            </h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
                ))}
                {orders.length === 0 && (
                    <p className="text-center py-10 text-neutral-dark opacity-30 italic dark:text-gray-500">{t.noOrders}</p>
                )}
            </div>
        </div>
    )
};

const OrderTracking: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurantData();
  const lang = (localStorage.getItem('lang') as any) || 'ar';
  const t = uiTranslations[lang as keyof typeof uiTranslations];

  const groupedOrders = useMemo(() => {
    const groups: { [key in OrderStatus]?: Order[] } = {};
    for (const order of orders) {
      if (!groups[order.status]) {
        groups[order.status] = [];
      }
      groups[order.status]?.push(order);
    }
    return groups;
  }, [orders]);

  const orderColumns: OrderStatus[] = [OrderStatus.NEW, OrderStatus.IN_PROGRESS, OrderStatus.READY, OrderStatus.COMPLETED];

  return (
    <div className="space-y-6 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-right">
        <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">{t.orderTracking}</h1>
        <p className="mt-1 text-neutral-dark opacity-75 dark:text-gray-400">{t.liveTrackingDesc}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {orderColumns.map(status => (
            <OrderColumn 
                key={status}
                title={status}
                orders={(groupedOrders[status] || []).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())}
                onStatusChange={updateOrderStatus}
            />
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
