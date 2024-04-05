import httpStatusCodes from "./httpStatusCodes.js";
import BaseError from "./BaseError.js";

class Api404Error extends BaseError {
  constructor(
    name,
    status = httpStatusCodes.NOT_FOUND,
    description = "Requested object not found.",
    isOperational = true
  ) {
    super(name, status, isOperational, description);
  }
}

export default Api404Error;
