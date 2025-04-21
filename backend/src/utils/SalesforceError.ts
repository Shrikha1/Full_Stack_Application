export class SalesforceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public originalError?: any
  ) {
    super(message)
    this.name = 'SalesforceError'
  }

  static fromError(error: any): SalesforceError {
    if (error instanceof SalesforceError) {
      return error
    }

    // Handle common Salesforce API errors
    if (error.errorCode) {
      return new SalesforceError(
        error.message || 'Salesforce API error',
        error.errorCode,
        error.statusCode || 500,
        error
      )
    }

    // Handle connection errors
    if (error.name === 'ConnectionError') {
      return new SalesforceError(
        'Failed to connect to Salesforce',
        'CONNECTION_ERROR',
        503,
        error
      )
    }

    // Handle timeout errors
    if (error.name === 'TimeoutError') {
      return new SalesforceError(
        'Request to Salesforce timed out',
        'TIMEOUT_ERROR',
        504,
        error
      )
    }

    // Default error
    return new SalesforceError(
      'An unexpected error occurred with Salesforce',
      'UNKNOWN_ERROR',
      500,
      error
    )
  }
} 