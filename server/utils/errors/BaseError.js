class BaseError extends Error {
  constructor(name, status, isOperational, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.status = status;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export default BaseError;
