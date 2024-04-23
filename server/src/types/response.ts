export type SuccessResponseFormat<T = void> = {
  status: 'success';
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponseFormat<T = string> = {
  status: 'error';
  message: string;
  details?: T;
};
