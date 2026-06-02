import * as XLSX from "xlsx";
import { Product, ProductCategory, CATEGORY_LABELS } from "@/lib/products";

export type ProductRow = {
  nome: string;
  descricao: string;
  categoria: string;
  compostos_principais: string;
  quantidade_base: string;
  pedido_min_qtd: number;
  pedido_min_valor: number;
  pedido_m_qtd: number;
  pedido_m_valor: number;
  pedido_g_qtd: number;
  pedido_g_valor: number;
  imagem_url: string;
  mais_vendido: string;
  ordem: number;
};

const CATEGORY_OPTIONS = "cosmeticos | nutraceuticos | ultra_fitoterapicos";

const HEADERS: (keyof ProductRow)[] = [
  "nome",
  "descricao",
  "categoria",
  "compostos_principais",
  "quantidade_base",
  "pedido_min_qtd",
  "pedido_min_valor",
  "pedido_m_qtd",
  "pedido_m_valor",
  "pedido_g_qtd",
  "pedido_g_valor",
  "imagem_url",
  "mais_vendido",
  "ordem",
];

export const downloadTemplate = () => {
  const example: ProductRow = {
    nome: "Exemplo Suplemento",
    descricao: "Breve descrição do produto",
    categoria: "nutraceuticos",
    compostos_principais: "Vitamina C, Zinco",
    quantidade_base: "60 cápsulas",
    pedido_min_qtd: 100,
    pedido_min_valor: 1500,
    pedido_m_qtd: 500,
    pedido_m_valor: 6500,
    pedido_g_qtd: 1000,
    pedido_g_valor: 12000,
    imagem_url: "",
    mais_vendido: "nao",
    ordem: 0,
  };

  const instructions = [
    ["INSTRUÇÕES DE PREENCHIMENTO"],
    [],
    ["Coluna", "Descrição"],
    ["nome", "Nome do produto (obrigatório)"],
    ["descricao", "Descrição livre"],
    ["categoria", `Use exatamente um dos valores: ${CATEGORY_OPTIONS}`],
    ["compostos_principais", "Lista de compostos, ex: 'Vitamina C, Zinco'"],
    ["quantidade_base", "Quantidade base de produção, ex: '60 cápsulas'"],
    ["pedido_min_qtd / valor", "Quantidade e valor (R$) do pedido mínimo"],
    ["pedido_m_qtd / valor", "Quantidade e valor (R$) do pedido médio"],
    ["pedido_g_qtd / valor", "Quantidade e valor (R$) do pedido grande"],
    ["imagem_url", "URL pública da imagem (opcional)"],
    ["mais_vendido", "sim ou nao"],
    ["ordem", "Número inteiro para ordenação (menor aparece primeiro)"],
    [],
    ["Categorias válidas:"],
    ...Object.entries(CATEGORY_LABELS).map(([k, v]) => [k, v]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([example], { header: HEADERS });
  ws["!cols"] = HEADERS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, "Produtos");

  const wsInfo = XLSX.utils.aoa_to_sheet(instructions);
  wsInfo["!cols"] = [{ wch: 32 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Instruções");

  XLSX.writeFile(wb, "modelo-produtos-ultracaps.xlsx");
};

export const exportProducts = (products: Product[]) => {
  const rows: ProductRow[] = products.map((p) => ({
    nome: p.name,
    descricao: p.description ?? "",
    categoria: p.category,
    compostos_principais: p.main_compounds ?? "",
    quantidade_base: p.base_quantity ?? "",
    pedido_min_qtd: p.min_order_qty,
    pedido_min_valor: Number(p.min_order_price),
    pedido_m_qtd: p.m_order_qty,
    pedido_m_valor: Number(p.m_order_price),
    pedido_g_qtd: p.g_order_qty,
    pedido_g_valor: Number(p.g_order_price),
    imagem_url: p.image_url ?? "",
    mais_vendido: p.is_bestseller ? "sim" : "nao",
    ordem: p.sort_order,
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows, { header: HEADERS });
  ws["!cols"] = HEADERS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, "Produtos");
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `produtos-ultracaps-${date}.xlsx`);
};

export type ParsedProduct = {
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
};

export type ParseResult = {
  products: ParsedProduct[];
  errors: string[];
};

const validCategories: ProductCategory[] = [
  "cosmeticos",
  "nutraceuticos",
  "ultra_fitoterapicos",
];

const num = (v: unknown): number => {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return v;
  const parsed = Number(String(v).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const truthy = (v: unknown): boolean => {
  const s = String(v ?? "").trim().toLowerCase();
  return ["sim", "true", "1", "yes", "y", "x"].includes(s);
};

export const parseSheet = async (file: File): Promise<ParseResult> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes("produto")) ?? wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

  const errors: string[] = [];
  const products: ParsedProduct[] = [];

  rows.forEach((row, idx) => {
    const lineNum = idx + 2;
    const name = String(row.nome ?? "").trim();
    if (!name) {
      errors.push(`Linha ${lineNum}: nome obrigatório (linha ignorada)`);
      return;
    }
    const categoria = String(row.categoria ?? "").trim() as ProductCategory;
    if (!validCategories.includes(categoria)) {
      errors.push(`Linha ${lineNum} (${name}): categoria inválida "${categoria}". Use: ${CATEGORY_OPTIONS}`);
      return;
    }
    products.push({
      name,
      description: String(row.descricao ?? "").trim() || null,
      category: categoria,
      main_compounds: String(row.compostos_principais ?? "").trim() || null,
      base_quantity: String(row.quantidade_base ?? "").trim() || null,
      min_order_qty: Math.round(num(row.pedido_min_qtd)),
      min_order_price: num(row.pedido_min_valor),
      m_order_qty: Math.round(num(row.pedido_m_qtd)),
      m_order_price: num(row.pedido_m_valor),
      g_order_qty: Math.round(num(row.pedido_g_qtd)),
      g_order_price: num(row.pedido_g_valor),
      image_url: String(row.imagem_url ?? "").trim() || null,
      is_bestseller: truthy(row.mais_vendido),
      sort_order: Math.round(num(row.ordem)),
    });
  });

  return { products, errors };
};
