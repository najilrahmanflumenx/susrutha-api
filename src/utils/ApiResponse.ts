export class ApiResponse<T = any> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T;
  public meta?: Record<string, any>;

  constructor(statusCode: number, message: string, data: T, meta?: Record<string, any>) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  static success<T = any>(data: T, message: string = 'Success', meta?: Record<string, any>) {
    return new ApiResponse(200, message, data, meta);
  }
}
