import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  payment_method: string;
  paymob_order_id?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_title: string;
  product_image: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            product_title,
            product_image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false, error: 'Failed to update order status' };
    }
  };

  const createOrder = async (orderData: {
    total_amount: number;
    currency: string;
    payment_method: string;
    paymob_order_id?: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      product_title: string;
      product_image: string;
    }>;
  }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const orderId = `order_${Date.now()}_${user.id}`;

      // Create the order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          total_amount: orderData.total_amount,
          currency: orderData.currency,
          status: 'pending',
          payment_method: orderData.payment_method,
          paymob_order_id: orderData.paymob_order_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map(item => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product_title: item.product_title,
        product_image: item.product_image,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Refresh orders
      await fetchOrders();

      return { success: true, orderId };
    } catch (err) {
      console.error('Error creating order:', err);
      return { success: false, error: 'Failed to create order' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    createOrder,
  };
};