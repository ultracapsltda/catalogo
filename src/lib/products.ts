export type ProductCategory = "cosmeticos" | "nutraceuticos" | "ultra_fitoterapicos";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  main_compounds: string | null;
  base_quantity: string | null;
  min_order_qty: number;
  min_order_price: number;
  m_order_qty: number;
  m_order_price: number;
  g_order_qty: number;
  g_order_price: number;
  image_url: string | null;
  is_bestseller: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cosmeticos: "Cosméticos",
  nutraceuticos: "Nutracêuticos",
  ultra_fitoterapicos: "ULTRA-Fitoterápicos",
};

export const CATEGORY_SLUGS: Record<string, ProductCategory> = {
  cosmeticos: "cosmeticos",
  nutraceuticos: "nutraceuticos",
  "ultra-fitoterapicos": "ultra_fitoterapicos",
};

export const formatBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
