const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Project System API",
      version: version,
      description: `
        Professional API documentation for the Student Project System backend.
        
        ### Access Control
        Most endpoints require a valid JWT. Look for the **Authorize** button to add your token.
        
        ### Standard Response Structure
        All responses follow a predictable JSON format to simplify client-side consumption.
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },

    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5000/api/v1",
        description: process.env.NODE_ENV === "production" ? "Production Server" : "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your bearer token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            role: { type: "string", enum: ["admin", "faculty", "student"] },
            avatar: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Student: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            rollNumber: { type: "string" },
            department: { type: "string" },
            year: { type: "integer", minimum: 1, maximum: 5 },
            projects: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            status: { type: "string", enum: ["planning", "in_progress", "completed", "on_hold", "cancelled"] },
            progress: { type: "integer", minimum: 0, maximum: 100 },
            members: { type: "array", items: { type: "string" } },
            guide: { type: "string", nullable: true },
            createdBy: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object", nullable: true },
            error: { type: "string", nullable: true },
          },
        },
      },
    },

    security: [{ BearerAuth: [] }],

    tags: [
      { name: "Auth", description: "Identity & Session Management" },
      { name: "Dashboard", description: "Aggregated System Statistics" },
      { name: "Core", description: "Students, Projects, and Staff management" },
      { name: "Academic", description: "Assignments, Courses, and Submissions" },
      { name: "Communication", description: "Messaging, Meetings, and Notifications" },
      { name: "System", description: "Settings, Audit Logs, and Support" },
    ],
  },

  apis: ["./routes/*.js", "./models/*.js"], // Scan routes and models for documentation
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "Student Project System API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "list",
        filter: true,
        displayRequestDuration: true,
      },
    }),
  );
};
