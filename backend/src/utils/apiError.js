class ApiError extends Error {
    constructor(
      statusCode,
      message = "OOPS! Something went wrong.",
      errors = [],
      stack
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.error = errors;
      this.message = message;
      this.success = false;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, constructor);
      }
    }
  }
  
  export { ApiError };
  