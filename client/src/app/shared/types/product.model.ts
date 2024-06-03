export type ProductList = {
  status: string;
  paginationInfo: PaginationInfo;
  data: Product[];
};

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
  discount: ProductDiscount;
  discountedPrice: string;
  createdAt: Date;
};

export enum DiscountType {
  percentage = 'percentage',
  fixed = 'fixed',
}

export type ProductDiscount = {
  id: string;
  productId: string;
  type: DiscountType;
  value: number;
  startDate: Date;
  endDate: Date;
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

export type Order = 'asc' | 'desc';

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

export type Condition = 'new' | 'used';
export enum Size {
  xs = 'xs',
  s = 's',
  m = 'm',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl',
}

export type PaginationInfo = {
  count: number;
  page: number;
  perPage: number;
  totalPages: number;
};
