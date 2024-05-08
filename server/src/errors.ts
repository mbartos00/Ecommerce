export class HttpError<T> extends Error {
  code: number;
  details?: T;

  constructor(message: string, code: number = 400, details?: T) {
    super(message);
    this.details = details;
    this.code = code;
  }
}
