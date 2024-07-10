export type ProductList = {
  status: string;
  paginationInfo: PaginationInfo;
  data: Product[];
};

export type BestSellerList = {
  status: string;
  data: ProductWithSales[];
};

export type ProductWithSales = {
  totalSales: number;
  productDetails: Product;
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
  discount: ProductDiscount | null;
  discountedPrice?: string;
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
  quantity?: number;
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
  size: string;
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

export type ProductInCart = {
  id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  variantId: string;
  color: string;
  condition: Condition;
  size: string;
  availableQuantity: number;
  quantityToBuy: number;
};

export type AvailabilityData = {
  productId: string;
  variantId: string;
  availableQuantity?: number;
  quantityToBuy: number;
  isAvailable?: boolean;
};

export type ProductFilters = {
  status: string;
  data: Filter[];
};

export type Filter = {
  color: {
    color: string;
  }[];
  size: {
    size: Size;
  }[];
  condition: {
    condition: 'new' | 'used';
  }[];
  price: {
    _min: { price: number };
    _max: { price: number };
  };
  brand: {
    brand: string;
  }[];
};
