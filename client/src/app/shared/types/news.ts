export type News = {
  id: string;
  title: string;
  imageUrl: string;
  description_short: string;
  content: string;
  news_category_id: string;
  category: NewsCategory;
  author_full_name: string;
  createdAt: Date;
};

export type NewsCategory = {
  id: string;
  name: string;
  news: News[];
};
