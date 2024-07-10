import { PaginationInfo } from './product.model';

export type NewsList = {
  paginationInfo: PaginationInfo;
  status: string;
  data: News[];
};

export type LatestNews = {
  status: string;
  paginationInfo: PaginationInfo;
  data: News[];
};

export type News = {
  id: string;
  title: string;
  imageUrl: string;
  description_short: string;
  content: string;
  news_category_id: string;
  author_full_name: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
};

export type NewsCategory = {
  id: string;
  name: string;
  news: News[];
};

export type Order = 'asc' | 'desc';

export type QueryParams = {
  page?: string;
  perPage?: string;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: Order;
  limit?: number;
};
