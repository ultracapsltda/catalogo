import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/products";
import {
  downloadTemplate,
  exportProducts,
  parseSheet,
} from "@/lib/productsSheet";
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
import { ParsedProduct } from "@/lib/productsSheet";

interface Props {
  products: Product[];
  onImported: () => void;
}

export const ImportExportCard = ({ products, onImported }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [pending, setPending] = useState<{
    products: ParsedProduct[];
    errors: string[];
  } | null>(null);
  const [mode, setMode] = useState<"append" | "replace">("append");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await parseSheet(file);
      if (result.products.length === 0) {
        toast.error("Nenhum produto válido na planilha");
        if (result.errors.length) console.warn(result.errors);
        return;
      }
      setPending(result);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível ler a planilha");
    }
  };

  const confirmImport = async () => {
    if (!pending) return;
    setImporting(true);
    try {
      if (mode === "replace") {
        const { error: delErr } = await supabase
          .from("products")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        if (delErr) throw delErr;
      }
      const { error } = await supabase.from("products").insert(pending.products);
      if (error) throw error;
      toast.success(
        `${pending.products.length} produto(s) importado(s)${
          pending.errors.length ? ` · ${pending.errors.length} aviso(s)` : ""
        }`
      );
      if (pending.errors.length) console.warn("Avisos:", pending.errors);
      setPending(null);
      onImported();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Erro ao importar");
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-[220px]">
            <h2 className="font-display text-lg font-semibold">
              Importar / exportar planilha
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Baixe o modelo, preencha em Excel/Google Sheets e importe em lote.
              Você também pode exportar o catálogo atual.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" /> Modelo
            </Button>
            <Button
              variant="outline"
              onClick={() => exportProducts(products)}
              disabled={products.length === 0}
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
            <Button onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" /> Importar
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && !importing && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar importação</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  <strong>{pending?.products.length}</strong> produto(s) prontos para importar.
                  {pending?.errors.length ? (
                    <span className="block text-destructive text-sm mt-1">
                      {pending.errors.length} linha(s) ignorada(s) — veja o console.
                    </span>
                  ) : null}
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === "append"}
                      onChange={() => setMode("append")}
                    />
                    Adicionar aos produtos existentes
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={mode === "replace"}
                      onChange={() => setMode("replace")}
                    />
                    <span>
                      Substituir todo o catálogo{" "}
                      <span className="text-destructive">(apaga os atuais)</span>
                    </span>
                  </label>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmImport(); }} disabled={importing}>
              {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Importar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
