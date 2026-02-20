import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Order = {
  id: string;
  customer_name: string;
  order_number: string;
  status: 'pending' | 'shipped' | 'delivered';
  total: number;
  created_at: string;
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setOrders(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { orders, loading };
}
