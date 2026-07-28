export class ApiError extends Error {
  public statusCode: number;
  public errors: any[];
  public isOperational: boolean;

  constructor(statusCode: number, message: string, errors: any[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden resource access') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }
}
