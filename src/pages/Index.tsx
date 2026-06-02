import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { NavLink } from "react-router-dom";
import { Leaf, Sparkles, FlaskConical } from "lucide-react";

const categories = [
  {
    to: "/categoria/cosmeticos",
    label: "Cosméticos",
    desc: "Beleza com base ativa funcional",
    icon: Sparkles,
  },
  {
    to: "/categoria/nutraceuticos",
    label: "Nutracêuticos",
    desc: "Saúde e performance pelo nutriente",
    icon: Leaf,
  },
  {
    to: "/categoria/ultra-fitoterapicos",
    label: "ULTRA-Fitoterápicos",
    desc: "Linha premium em alta concentração",
    icon: FlaskConical,
  },
];

const Index = () => {
  const { products, loading } = useProducts({ bestsellersOnly: true });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="container pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              <span className="w-8 h-px bg-primary" />
              Catálogo ULTRACAPS
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-normal leading-[1.05] tracking-tight">
              Suplementos formulados com{" "}
              <span className="text-gradient-brand italic">precisão e cuidado</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Linhas completas em cosméticos, nutracêuticos e fitoterápicos.
              Explore os produtos mais vendidos ou navegue pela categoria de seu interesse.
            </p>
          </div>

          {/* Categorias */}
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {categories.map(({ to, label, desc, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className="group rounded-3xl border border-border/70 bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-primary-foreground mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{label}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </NavLink>
            ))}
          </div>
        </section>

        {/* MAIS VENDIDOS */}
        <section className="container pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Destaques
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">
                Produtos mais vendidos
              </h2>
            </div>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage="Nenhum produto marcado como mais vendido. Configure no painel admin."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
