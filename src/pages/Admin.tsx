import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_LABELS, Product, formatBRL } from "@/lib/products";
import { cn, resolveImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Lock, LogOut, Star } from "lucide-react";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";
import { ImportExportCard } from "@/components/admin/ImportExportCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { unlocked, login, logout, loading } = useAdminAuth();
  const [password, setPassword] = useState("");
  const { products, refetch } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (!ok) toast.error("Senha incorreta");
    else toast.success("Bem-vindo");
  };

  const toggleBestseller = async (p: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_bestseller: !p.is_bestseller })
      .eq("id", p.id);
    if (error) toast.error("Erro ao atualizar");
    else { toast.success("Atualizado"); refetch(); }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("products").delete().eq("id", deleting.id);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("Excluído"); refetch(); }
    setDeleting(null);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container flex items-center justify-center py-20">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-card"
          >
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-primary-foreground mb-5">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Acesso administrador</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Insira a senha para gerenciar o catálogo.
            </p>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="mb-4"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Entrar
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Senha padrão: <code className="font-mono">admin123</code>
            </p>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
              Painel
            </span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">
              Gerenciar produtos
            </h1>
            <p className="mt-2 text-muted-foreground">
              {products.length} produtos cadastrados. Marque como “mais vendido” para destacar na home.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Novo produto
            </Button>
          </div>
        </div>

        <ImportExportCard products={products} onImported={refetch} />

        <SettingsCard />

        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium hidden md:table-cell">Categoria</th>
                <th className="p-4 font-medium hidden lg:table-cell">Mín / M / G</th>
                <th className="p-4 font-medium text-center">Destaque</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">
                  Nenhum produto cadastrado. Clique em “Novo produto”.
                </td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={resolveImageUrl(p.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg gradient-brand opacity-30" />
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.base_quantity}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-xs text-muted-foreground">
                    {formatBRL(Number(p.min_order_price))} · {formatBRL(Number(p.m_order_price))} · {formatBRL(Number(p.g_order_price))}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleBestseller(p)}
                      className={`inline-flex p-2 rounded-full transition-smooth ${
                        p.is_bestseller ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                      }`}
                      aria-label="Alternar mais vendido"
                    >
                      <Star className="w-4 h-4" fill={p.is_bestseller ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleting(p)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        onSaved={refetch}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto “{deleting?.name}” será removido do catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

const SettingsCard = () => {
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (pwd.length < 4) {
      toast.error("Senha deve ter ao menos 4 caracteres");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: "admin_password", value: pwd });
    setSaving(false);
    if (error) toast.error("Erro ao salvar");
    else { toast.success("Senha atualizada"); setPwd(""); }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card mb-8 flex flex-col md:flex-row md:items-end gap-4">
      <div className="flex-1">
        <Label>Alterar senha de administrador</Label>
        <Input
          type="password"
          placeholder="Nova senha"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="mt-2"
        />
      </div>
      <Button onClick={save} disabled={saving} variant="outline">
        Atualizar senha
      </Button>
    </div>
  );
};

export default Admin;
