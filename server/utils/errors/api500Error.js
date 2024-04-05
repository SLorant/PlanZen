import httpStatusCodes from "./httpStatusCodes.js";
import BaseError from "./BaseError.js";

class Api500Error extends BaseError {
  constructor(
    name,
    status = httpStatusCodes.INTERNAL_SERVER,
    description = "Internal server error.",
    isOperational = true
  ) {
    super(name, status, isOperational, description);
  }
}

export default Api500Error;
