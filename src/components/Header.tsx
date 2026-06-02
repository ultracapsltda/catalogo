import { NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home" },
  { to: "/categoria/cosmeticos", label: "Cosméticos" },
  { to: "/categoria/nutraceuticos", label: "Nutracêuticos" },
  { to: "/categoria/ultra-fitoterapicos", label: "ULTRA-Fitoterápicos" },
];

export const Header = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-6">
        <NavLink to="/" className="shrink-0">
          <Logo size={42} />
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-smooth",
                  active
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <NavLink
          to="/admin"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-smooth",
            pathname.startsWith("/admin")
              ? "gradient-brand text-primary-foreground shadow-soft"
              : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
          )}
        >
          Acesso administrador
        </NavLink>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3">
        {items.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-smooth",
                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};
