import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  size_options: { size: string; price: number }[];
  scent_profiles: { name: string; icon: string }[];
  fragrance_notes: { top: string[]; heart: string[]; base: string[] };
  rating: number;
  review_count: number;
  is_new: boolean;
  is_limited: boolean;
};

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  async function fetchProducts() {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');
      
      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data, error: err } = await query.order('created_at', { ascending: false });
      if (err) throw err;
      setProducts(data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}
