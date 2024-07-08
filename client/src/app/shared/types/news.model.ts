import { PaginationInfo } from './product.model';

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
