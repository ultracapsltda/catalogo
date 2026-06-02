import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid = ({ products, loading, emptyMessage = "Nenhum produto encontrado." }: Props) => {
  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-3xl bg-muted/60 animate-pulse"
          />
        ))}
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">{emptyMessage}</div>
    );
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <div key={p.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-in-up">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
};
