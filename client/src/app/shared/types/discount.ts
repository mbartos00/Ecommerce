export interface Discount {
  id?: string;
  status?: string;
  code: string;
  discount_amount: number;
  discount_type: string;
  message: string;
}
