type Order = 'asc' | 'desc';

export type QueryParams = {
  page?: string;
  perPage?: string;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: Order;
  limit?: number;
};
