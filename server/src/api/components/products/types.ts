type Order = 'asc' | 'desc';

export type QueryParams = {
  page?: string;
  perPage?: string;
  search?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  sort_by?: string;
  order?: Order;
  color?: string;
  brand?: string;
  condition?: string;
  size?: string;
  sortBy?: string;
};
