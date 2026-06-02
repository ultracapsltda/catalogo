import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="mt-24 border-t border-border/60 bg-muted/30">
    <div className="container py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <Logo size={36} />
      <p className="text-sm text-muted-foreground max-w-md">
        Catálogo interativo de suplementos. Quantidades e valores podem ser ajustados pelo administrador a qualquer momento.
      </p>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} ULTRACAPS
      </p>
    </div>
  </footer>
);
