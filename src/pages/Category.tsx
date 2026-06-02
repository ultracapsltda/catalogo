import { useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/products";

const Category = () => {
  const { slug = "" } = useParams();
  const category = CATEGORY_SLUGS[slug];
  if (!category) return <Navigate to="/" replace />;

  const { products, loading } = useProducts({ category });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
          Categoria
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">
          {CATEGORY_LABELS[category]}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          {products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}.
          Clique em qualquer item para visualizar quantidades e valores.
        </p>

        <div className="mt-12">
          <ProductGrid products={products} loading={loading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
