// Aisa error jis ke saath HTTP status code bhi ho (e.g. 400, 404)
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
