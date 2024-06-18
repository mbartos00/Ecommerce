export type LoginSchema = {
  email: string;
  password: string;
};

export type SignupSchema = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  avatarImage: File;
};

export type ContactFormSchema = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};
