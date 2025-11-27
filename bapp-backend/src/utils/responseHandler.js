/**
 * Response Handler Utility
 * Standardized API response formats
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 */
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {Object} errors - Validation errors (optional)
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Array} data - Array of data
 * @param {Object} pagination - Pagination metadata
 */
const paginatedResponse = (res, statusCode, message, data, pagination) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    }
  });
};

/**
 * Created response (201)
 */
const createdResponse = (res, message, data) => {
  return successResponse(res, 201, message, data);
};

/**
 * OK response (200)
 */
const okResponse = (res, message, data) => {
  return successResponse(res, 200, message, data);
};

/**
 * Bad request response (400)
 */
const badRequestResponse = (res, message, errors = null) => {
  return errorResponse(res, 400, message, errors);
};

/**
 * Unauthorized response (401)
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, 401, message);
};

/**
 * Forbidden response (403)
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, 403, message);
};

/**
 * Not found response (404)
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

/**
 * Internal server error response (500)
 */
const serverErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(res, 500, message);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse
};