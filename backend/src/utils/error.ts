export interface ErrorMetadata {
  code?: string;
  [key: string]: any;
}

export class AppError extends Error {
  public readonly metadata: ErrorMetadata;
  
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    metadata: ErrorMetadata = {}
  ) {
    super(message);
    this.metadata = metadata;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * Converts the error to a plain object suitable for JSON serialization
   */
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      ...this.metadata
    };
  }
}