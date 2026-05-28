export interface Category {
  id: number;
  userId: number;
  name: string;
  kind: "INGRESO" | "GASTO";
  color: string | null;
}

export interface CreateCategoryBody {
  name: string;
  kind: "INGRESO" | "GASTO";
  color?: string;
}
