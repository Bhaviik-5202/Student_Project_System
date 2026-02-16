const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Project System API",
      version: "1.0.0",
      description: `
Professional API documentation for the Student Project System backend.

### Features
- Clean MVC architecture
- Standardized response format
- JWT Authentication (Bearer Token)
- Pagination & Filtering
- Centralized error handling

### Standard Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "error": null
}
\`\`\`

### Standard Error Response
\`\`\`json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": "Email is required"
}
\`\`\`
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development Server",
      },
      {
        url: "https://your-production-domain.com/api/v1",
        description: "Production Server",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [{ BearerAuth: [] }],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Users", description: "User management" },
      { name: "Students", description: "Student management" },
      { name: "Projects", description: "Project management" },
      { name: "Assignments", description: "Assignment management" },
      { name: "Submissions", description: "Submission management" },
      { name: "Resources", description: "Learning resources" },
      { name: "SupportTickets", description: "Support ticket system" },
      { name: "Settings", description: "System configuration" },
    ],
  },

  apis: ["./routes/*.js"], // Only route files needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Student Project System API Docs",
    }),
  );
};
