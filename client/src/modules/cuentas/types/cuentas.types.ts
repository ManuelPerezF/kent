export interface Account {
  id: number;
  userId: number;
  name: string;
  type: "EFECTIVO" | "TARJETA";
  initialBalance: number;
}

export interface CreateAccountBody {
  name: string;
  type: "EFECTIVO" | "TARJETA";
  initialBalance?: number;
}
