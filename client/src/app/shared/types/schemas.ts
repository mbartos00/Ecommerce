export type LoginSchema = {
  email: string;
  password: string;
};

export type SignupSchema = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

export type ContactFormSchema = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};
