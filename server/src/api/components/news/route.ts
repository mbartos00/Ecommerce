import { Router } from 'express';
import type { Dependecies } from '@src/config/dependencies';
import { getAllNews } from './controllers/get-all-news';
import { getNewsById } from './controllers/get-news-by-id';
import { getLatestNews } from './controllers/get-latest-news';
import { getNewsCategories } from './controllers/get-news-categories';

export function newsRouter(deps: Dependecies) {
  const router = Router();

  router.get('/', getAllNews(deps));
  router.get('/latest', getLatestNews(deps));
  router.get('/categories', getNewsCategories(deps));
  router.get('/:id', getNewsById(deps));

  return router;
}
