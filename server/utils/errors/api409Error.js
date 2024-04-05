import httpStatusCodes from "./httpStatusCodes.js";
import BaseError from "./BaseError.js";

class Api409Error extends BaseError {
  constructor(
    name,
    status = httpStatusCodes.CONFLICT,
    description = "There was a conflict when creating a record.",
    isOperational = true
  ) {
    super(name, status, isOperational, description);
  }
}

export default Api409Error;
