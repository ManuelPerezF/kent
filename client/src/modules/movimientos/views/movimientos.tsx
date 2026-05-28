import AppShell from "@/shared/layout/app-shell";
import MovimientosTable from "../components/movimientosTable";
import { useMovimientos } from "../hooks/useMovimientos";

export default function Movimientos() {
  const {
    status,
    error,
    accounts,
    categories,
    filteredTransactions,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    totalAmount,
    accountMap,
    categoryMap,
    creating,
    createError,
    addMovement,
  } = useMovimientos();

  return (
    <AppShell>
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando movimientos...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">{error}</p>
        </div>
      ) : null}

      {status === "success" ? (
        <MovimientosTable
          transactions={filteredTransactions}
          accounts={accounts}
          categories={categories}
          accountMap={accountMap}
          categoryMap={categoryMap}
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          totalAmount={totalAmount}
          creating={creating}
          createError={createError}
          onCreateMovement={addMovement}
        />
      ) : null}
    </AppShell>
  );
}
