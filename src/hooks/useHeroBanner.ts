import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  badge_text: string;
};

export function useHeroBanner() {
  const [banner, setBanner] = useState<HeroBanner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .single();
      setBanner(data);
      setLoading(false);
    }
    fetch();
  }, []);

  return { banner, loading };
}
