import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/products";

export const useProducts = (filter?: { category?: string; bestsellersOnly?: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
    if (filter?.category) q = q.eq("category", filter.category as Product["category"]);
    if (filter?.bestsellersOnly) q = q.eq("is_bestseller", true);
    const { data, error } = await q;
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.category, filter?.bestsellersOnly]);

  return { products, loading, refetch: fetchProducts };
};
