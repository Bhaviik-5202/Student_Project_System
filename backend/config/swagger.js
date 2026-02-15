const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Project System API',
      version: '1.0.0',
      description: `Professional API documentation for the Student Project System backend.\n\n**Features:**\n- Clean architecture\n- Consistent error handling\n- JWT authentication\n- Pagination, filtering, and more.\n\n**Error Response Example:**\n\n\u0060\u0060\u0060json\n{\n  "error": true,\n  "data": null,\n  "message": "Validation failed",\n  "details": ["Email is required"]\n}\n\u0060\u0060\u0060\n`,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: true },
            data: { type: 'null', example: null },
            message: { type: 'string', example: 'Validation failed' },
            details: {
              type: 'array',
              items: { type: 'string' },
              example: ['Email is required'],
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: false },
            data: { type: 'object', example: { id: '123', name: 'John Doe' } },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
