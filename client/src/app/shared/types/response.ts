export type ResponseFormat<T = void> = {
  status: 'success';
} & (T extends void ? {} : { data: T });

export type ErrorResponseFormat<T = string> = {
  status: 'error';
  message: string;
  details?: T;
};
