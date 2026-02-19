export interface DealState {
  deals: Deal[];
  status: "idle" | "loading" | "failed";
  offset: number;
  hasMore: boolean;
}

export interface Deal {
  id: number;
  title: string;
  imageUrl: string | null;
  targetAmount: number;
  ticketAmount: number;
  soldPercent: number;
  yieldPercent: number;
  validTo: string;
  currency: {
    id: number;
    code: string;
    symbol: string;
    name: string;
  };
}
