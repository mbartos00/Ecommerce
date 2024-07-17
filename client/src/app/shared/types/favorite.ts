import { Product } from '@app/shared/types/product.model';
import { User } from '@app/shared/types/user';

export type Favorites = {
  id: string;
  user: User;
  userId: string;
  products: Product[];
};
