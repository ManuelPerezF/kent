import AppShell from "@/shared/layout/app-shell";
import CategoriasPanel from "../components/categoriasPanel";
import { useCategorias } from "../hooks/useCategorias";

export default function Categorias() {
  const {
    status,
    error,
    expenseCategories,
    incomeCategories,
    creating,
    createError,
    addCategory,
  } = useCategorias();

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando categorias...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <CategoriasPanel
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          creating={creating}
          createError={createError}
          onCreateCategory={addCategory}
        />
      ) : null}
    </AppShell>
  );
}
