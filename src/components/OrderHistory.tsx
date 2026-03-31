import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { dataService, handleDataError, OperationType, Order, OrderItem } from '../services/dataService';

const OrderItemRow: React.FC<{ item: OrderItem }> = ({ item }) => {
  const [showGift, setShowGift] = useState(false);
  const hasDiscount = item.originalPrice && item.price < item.originalPrice;
  const badgeText = item.badge || (hasDiscount ? 'SALE' : (item.freeGift || item.selectableGifts) ? 'FREE GIFT' : null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            {item.image ? (
              <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-500">
                {item.quantity}x
              </div>
            )}
            {badgeText && (
              <div className={`absolute -top-2 -left-2 z-10 px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-sm flex items-center gap-1 ${
                badgeText.toUpperCase() === 'SALE'
                  ? 'bg-rose-500'
                  : badgeText.toUpperCase() === 'FREE GIFT'
                    ? 'bg-primary'
                    : 'bg-slate-900'
              }`}>
                {badgeText}
              </div>
            )}
            {item.image && (
              <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-2 border-white">
                {item.quantity}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-700 font-medium">{item.name}</span>
            {item.originalPrice && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-rose-500 font-bold">${item.price.toFixed(2)}</span>
                <span className="text-zinc-400 line-through">${item.originalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
        {!item.originalPrice && (
          <span className="text-zinc-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        )}
      </div>

      {(item.freeGift || item.selectableGifts) && (
        <div className="ml-15 mt-1">
          <button
            onClick={() => setShowGift(!showGift)}
            className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
          >
            {showGift ? 'Hide Gift Details' : 'Show Gift Details'}
            {showGift ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <AnimatePresence>
            {showGift && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  {item.freeGift && (
                    <div className="bg-secondary/25 border border-secondary/70 rounded-lg p-2 flex items-start gap-2">
                      <img src={item.freeGift.image} alt="Free Gift" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <p className="text-[9px] font-bold text-primary-dark uppercase tracking-wider mb-0.5">Free Gift Included</p>
                        <p className="text-xs text-primary-dark font-medium">{item.freeGift.name}</p>
                      </div>
                    </div>
                  )}

                  {item.selectableGifts && (
                    <div className="bg-secondary/25 border border-secondary/70 rounded-lg p-2">
                      <p className="text-[9px] font-bold text-primary-dark uppercase tracking-wider mb-1">Selectable Gift</p>
                      <p className="text-xs text-primary-dark font-medium">Gift selected at checkout</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getTimelineEvents = (order: Order) => {
    const events = [
      { status: 'pending', label: 'Order Placed', description: 'Your order has been received and is awaiting confirmation.' },
      { status: 'processing', label: 'Processing', description: 'We are preparing your items for shipment.' },
      { status: 'shipped', label: 'Shipped', description: 'Your package is on its way to you.' },
      { status: 'delivered', label: 'Delivered', description: 'Package has been successfully delivered.' },
    ];

    const currentIdx = getStatusStep(order.status);
    return events.slice(0, currentIdx + 1).reverse();
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    dataService.getOrders(user.uid)
      .then(setOrders)
      .catch((nextError) => {
        const normalized = handleDataError(nextError, OperationType.LIST, 'orders');
        setError(normalized.message || 'Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };

  const getStatusStep = (status: Order['status']) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  const simulateNextStep = async (order: Order) => {
    if (!user) return;

    const steps: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(order.status);

    if (currentIndex >= steps.length - 1 || order.status === 'cancelled') {
      return;
    }

    const nextStatus = steps[currentIndex + 1];

    try {
      setError(null);
      const updated = await dataService.updateOrderStatus(user.uid, order.id, nextStatus);
      setOrders(updated);
    } catch (nextError) {
      const normalized = handleDataError(nextError, OperationType.UPDATE, `orders/${order.id}`);
      setError(normalized.message || 'Failed to update order status.');
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading orders...</div>;

  if (error) {
    return (
      <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-zinc-100 shadow-sm">
        <Package className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
        <h3 className="text-lg font-medium text-zinc-900">No orders yet</h3>
        <p className="text-zinc-500">When you make a purchase, your orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const currentStep = getStatusStep(order.status);
        const isExpanded = expandedOrderId === order.id;

        return (
          <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div
              className="p-6 cursor-pointer"
              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-50 rounded-lg">
                    <Package className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Order #{order.orderNumber}</p>
                    <p className="text-sm font-semibold text-zinc-900">{order.createdAt.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium capitalize text-zinc-700">{order.status}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="text-zinc-500">
                  {order.items?.length || 0} items - {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency || 'USD' }).format(order.totalAmount)}
                </div>
                <div className="text-primary font-medium flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Real-time Tracking Active
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-50 bg-zinc-50/30"
                >
                  <div className="p-6 space-y-8">
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-200" />
                      <div
                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      />
                      <div className="relative flex justify-between">
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;
                          return (
                            <div key={label} className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${
                                isCompleted ? 'bg-primary text-white' : 'bg-white border-2 border-zinc-200 text-zinc-400'
                              } ${isCurrent ? 'ring-4 ring-secondary/60' : ''}`}>
                                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-primary' : 'text-zinc-400'}`}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <OrderItemRow key={idx} item={item} />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tracking Details</h4>
                          <div className="p-5 bg-white rounded-2xl border border-zinc-100 space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-zinc-50">
                              <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Tracking Number</p>
                                <p className="text-sm font-mono font-bold text-zinc-900">{order.trackingNumber || `LUM-${order.orderNumber}-TRK`}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Carrier</p>
                                <p className="text-sm font-bold text-primary">{order.carrier || 'Pet Shop Express'}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {getTimelineEvents(order).map((event, idx) => (
                                <div key={event.status} className="flex gap-4 relative">
                                  {idx !== getTimelineEvents(order).length - 1 && (
                                    <div className="absolute left-2 top-6 w-0.5 h-full bg-zinc-100" />
                                  )}
                                  <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${idx === 0 ? 'bg-primary ring-4 ring-secondary/60' : 'bg-zinc-200'}`} />
                                  <div>
                                    <p className={`text-xs font-bold ${idx === 0 ? 'text-zinc-900' : 'text-zinc-500'}`}>{event.label}</p>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">{event.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              simulateNextStep(order);
                            }}
                            className="w-full py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                          >
                            <Activity className="w-4 h-4" />
                            Simulate Next Status Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistory;
