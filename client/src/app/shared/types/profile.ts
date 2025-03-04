export type Profile = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  gender: string;
  birthday: Date;
  phone_number: string;
  profile_photo_url: string;
};

export type changePasswordProfile = Profile & {
  oldPassword?: string;
  newPassword?: string;
  repeatPassword?: string;
};
