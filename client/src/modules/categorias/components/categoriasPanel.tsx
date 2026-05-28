import type { Category } from "../types/categorias.types";
import { Button } from "@/shared/components/ui/button";
import PageHeader from "@/shared/components/page-header";
import { FormEvent, useState } from "react";

interface CategoriasPanelProps {
  expenseCategories: Category[];
  incomeCategories: Category[];
  creating: boolean;
  createError: string;
  onCreateCategory: (payload: {
    name: string;
    kind: "INGRESO" | "GASTO";
    color?: string;
  }) => Promise<void>;
}

function CategoryColumn({ title, categories }: { title: string; categories: Category[] }) {
  return (
    <article className="border border-border bg-card p-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-3 divide-y divide-border border border-border">
        {categories.map((category) => (
          <li key={category.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3">
            <p className="text-xl font-semibold tracking-tight">{category.name}</p>
            <span
              className="size-3 border border-border"
              style={{ backgroundColor: category.color ?? "var(--muted)" }}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function CategoriasPanel({
  expenseCategories,
  incomeCategories,
  creating,
  createError,
  onCreateCategory,
}: CategoriasPanelProps) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"INGRESO" | "GASTO">("GASTO");
  const [color, setColor] = useState("#3b82f6");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onCreateCategory({
      name: name.trim(),
      kind,
      color,
    });

    setName("");
    setKind("GASTO");
  }

  return (
    <section className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
      <PageHeader
        eyebrow="Kent / Categorias"
        title="Categorias separadas por ingreso y gasto."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 border border-border bg-card p-4 lg:grid-cols-[1.4fr_180px_120px_auto]"
      >
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nueva categoria"
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value as "INGRESO" | "GASTO")}
          className="h-10 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
        >
          <option value="GASTO">Gasto</option>
          <option value="INGRESO">Ingreso</option>
        </select>
        <input
          value={color}
          onChange={(event) => setColor(event.target.value)}
          type="color"
          className="h-10 w-full border border-border bg-background p-1"
        />
        <Button type="submit" className="h-10 rounded-none px-5 text-sm" disabled={creating}>
          {creating ? "Guardando..." : "Crear categoria"}
        </Button>
      </form>
      {createError ? <p className="text-sm text-destructive">{createError}</p> : null}

      <div className="grid gap-3 xl:grid-cols-2">
        <CategoryColumn title="Gasto" categories={expenseCategories} />
        <CategoryColumn title="Ingreso" categories={incomeCategories} />
      </div>
    </section>
  );
}
