import { User } from './user';

export type Address = {
  id: string;
  country: string;
  name: string;
  lastName: string;
  street_address: string;
  street_address_2: string;
  city: string;
  state_province_region: string;
  zip_code: string;
  phone_number: string;
  userId: string;
  user: User;
};
