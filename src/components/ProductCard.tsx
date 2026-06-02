import { useState } from "react";
import { Product, formatBRL } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const [open, setOpen] = useState(false);

  const tiers = [
    { label: "Pedido mínimo", qty: product.min_order_qty, price: product.min_order_price },
    { label: "Pedido M", qty: product.m_order_qty, price: product.m_order_price },
    { label: "Pedido G", qty: product.g_order_qty, price: product.g_order_price },
  ];

  return (
    <article
      className={cn(
        "group rounded-3xl bg-card border border-border/70 overflow-hidden shadow-card transition-smooth",
        "hover:-translate-y-1 hover:shadow-hover hover:border-primary/30"
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left"
        aria-expanded={open}
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain transition-smooth group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full gradient-brand opacity-25" />
            </div>
          )}
          {product.is_bestseller && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/95 text-primary shadow-soft">
              Mais vendido
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
            {product.name}
          </h3>
          {product.main_compounds && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
              {product.main_compounds}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {product.base_quantity || "—"}
            </span>
            <span className={cn(
              "inline-flex items-center gap-1 text-xs font-medium text-primary transition-smooth",
              open && "rotate-180"
            )}>
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 animate-expand-down border-t border-border/60 pt-4">
          {product.description && (
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {product.description}
            </p>
          )}
          <ul className="space-y-2">
            {tiers.map((t) => (
              <li
                key={t.label}
                className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2"
              >
                <div>
                  <div className="text-xs font-medium text-foreground">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground">{t.qty} unid.</div>
                </div>
                <div className="text-sm font-semibold text-primary">
                  {formatBRL(Number(t.price))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};
