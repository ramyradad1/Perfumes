import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      setCategories(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { categories, loading };
}
