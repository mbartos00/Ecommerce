import type { Condition, Size } from '@prisma/client';

export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  rating: number;
  price: number;
  images: string[];
  categoryIds: string[];
  categories: Omit<Category, 'products' | 'productIds'>[];
  favorites_list_id?: string | null;
  variants: Omit<Variant, 'productId' | 'product'>[];
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  productIds?: string[];
  products?: Product[];
};

export type Variant = {
  id: string;
  color: string;
  condition: Condition;
  size: Size;
  quantity: number;
  productId?: string;
  product?: Product;
};

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
