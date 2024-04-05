import httpStatusCodes from "./httpStatusCodes.js";
import BaseError from "./BaseError.js";

class Api401Error extends BaseError {
  constructor(
    name,
    status = httpStatusCodes.UNAUTHORIZED,
    description = "Unauthorized attempt at fetching resource.",
    isOperational = true
  ) {
    super(name, status, isOperational, description);
  }
}

export default Api401Error;
