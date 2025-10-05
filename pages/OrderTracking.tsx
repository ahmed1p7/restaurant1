import React, { useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import Button from '../components/Button';
import { MessageSquare } from 'lucide-react';

const OrderCard: React.FC<{ order: Order, onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ order, onStatusChange }) => {
    const { user } = useAuth();
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
    
    return (
        <Card className="p-4 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Table {order.tableId}</h3>
                    <span className="text-sm text-neutral-dark opacity-70">{order.id}</span>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            <div className="flex justify-between">
                                <span>{item.quantity}x {item.dish.name}</span>
                                <span>${(item.dish.price * item.quantity).toFixed(2)}</span>
                            </div>
                            {item.notes && (
                                <div className="mt-1 flex items-start text-xs text-neutral-dark opacity-90 bg-muted rounded p-2">
                                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-primary opacity-70" />
                                    <p className="italic leading-tight">{item.notes}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            {user?.role === Role.WAITER && nextStatus && (
                <Button className="w-full mt-4" onClick={() => onStatusChange(order.id, nextStatus)}>
                    Mark as {nextStatus}
                </Button>
            )}
        </Card>
    );
};


const OrderColumn: React.FC<{ title: OrderStatus; orders: Order[]; onStatusChange: (orderId: string, newStatus: OrderStatus) => void }> = ({ title, orders, onStatusChange }) => {
    const statusColors = {
        [OrderStatus.NEW]: 'bg-drinks-light',
        [OrderStatus.IN_PROGRESS]: 'bg-kitchen-light',
        [OrderStatus.READY]: 'bg-green-100',
        [OrderStatus.COMPLETED]: 'bg-muted',
        [OrderStatus.CANCELLED]: 'bg-red-100'
    };
    return (
        <div className={`${statusColors[title]} rounded-lg p-4`}>
            <h2 className="text-lg font-bold mb-4 text-neutral-dark">{title} ({orders.length})</h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
                ))}
            </div>
        </div>
    )
};

const OrderTracking: React.FC = () => {
  const { orders, updateOrderStatus } = useRestaurantData();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Order Tracking</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Live view of all orders in the kitchen.</p>
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