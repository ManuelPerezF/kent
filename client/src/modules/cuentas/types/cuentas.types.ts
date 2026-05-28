export interface Account {
  id: number;
  userId: number;
  name: string;
  type: "EFECTIVO" | "TARJETA";
  initialBalance: number;
  balance: number;
}

export interface CreateAccountBody {
  name: string;
  type: "EFECTIVO" | "TARJETA";
  initialBalance?: number;
}
