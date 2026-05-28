export interface Subscription {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  name: string;
  amount: number;
  nextBillingDate: string;
  active: number;
}

export interface CreateSubscriptionBody {
  accountId: number;
  categoryId: number;
  name: string;
  amount: number;
  nextBillingDate: string;
  active?: boolean;
}
