import { useEffect, useState } from "react";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product: Product | null;
  onSaved: () => void;
}

const empty = {
  name: "",
  description: "",
  category: "nutraceuticos" as ProductCategory,
  main_compounds: "",
  base_quantity: "",
  min_order_qty: 0,
  min_order_price: 0,
  m_order_qty: 0,
  m_order_price: 0,
  g_order_qty: 0,
  g_order_price: 0,
  image_url: "",
  is_bestseller: false,
};

export const ProductFormDialog = ({ open, onOpenChange, product, onSaved }: Props) => {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? "",
        category: product.category,
        main_compounds: product.main_compounds ?? "",
        base_quantity: product.base_quantity ?? "",
        min_order_qty: product.min_order_qty,
        min_order_price: Number(product.min_order_price),
        m_order_qty: product.m_order_qty,
        m_order_price: Number(product.m_order_price),
        g_order_qty: product.g_order_qty,
        g_order_price: Number(product.g_order_price),
        image_url: product.image_url ?? "",
        is_bestseller: product.is_bestseller,
      });
    } else {
      setForm(empty);
    }
  }, [product, open]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error("Erro no upload da imagem");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Imagem enviada");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      description: form.description || null,
      main_compounds: form.main_compounds || null,
      base_quantity: form.base_quantity || null,
      image_url: form.image_url || null,
    };
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar produto");
      return;
    }
    toast.success(product ? "Produto atualizado" : "Produto criado");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {product ? "Editar produto" : "Novo produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Nome *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as ProductCategory })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quantidade base de produção</Label>
              <Input
                placeholder="ex: 60 cápsulas"
                value={form.base_quantity}
                onChange={(e) => setForm({ ...form, base_quantity: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Compostos principais</Label>
              <Input
                placeholder="ex: Vitamina D, Magnésio"
                value={form.main_compounds}
                onChange={(e) => setForm({ ...form, main_compounds: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border p-4 space-y-3">
            <h4 className="text-sm font-semibold">Pedidos e valores</h4>
            {([
              ["Mínimo", "min_order_qty", "min_order_price"],
              ["Médio (M)", "m_order_qty", "m_order_price"],
              ["Grande (G)", "g_order_qty", "g_order_price"],
            ] as const).map(([label, qk, pk]) => (
              <div key={label} className="grid grid-cols-3 gap-3 items-center">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Quantidade"
                  value={form[qk]}
                  onChange={(e) => setForm({ ...form, [qk]: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Valor R$"
                  value={form[pk]}
                  onChange={(e) => setForm({ ...form, [pk]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Foto do produto</Label>
            <div className="flex items-center gap-4">
              {form.image_url ? (
                <img src={form.image_url} alt="preview" className="w-20 h-20 rounded-xl object-cover border" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  Sem foto
                </div>
              )}
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
                <div className="cursor-pointer rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-smooth flex items-center gap-2">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Enviando..." : "Selecionar imagem"}
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div>
              <Label className="text-base">Mais vendido</Label>
              <p className="text-xs text-muted-foreground">Aparece em destaque na home</p>
            </div>
            <Switch
              checked={form.is_bestseller}
              onCheckedChange={(v) => setForm({ ...form, is_bestseller: v })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {product ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
