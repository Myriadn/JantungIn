'use strict';

const errorHandler = {
  name: 'errorHandler',
  version: '1.0.0',
  register: async (server) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response;

      // Jika response adalah error
      if (!response.isBoom) {
        return h.continue;
      }

      const error = response;
      const statusCode = error.output.statusCode;

      // Format error response
      const errorResponse = {
        statusCode,
        error: error.output.payload.error,
        message: error.message || error.output.payload.message,
      };

      // Log error di development
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }

      return h.response(errorResponse).code(statusCode);
    });
  },
};

module.exports = errorHandler;
