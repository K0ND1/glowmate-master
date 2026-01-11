// backend/src/config/swagger.config.ts
import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GlowMate API',
      version: '1.0.0',
      description: 'API documentation for the GlowMate skincare application, covering authentication, products, routines, and AI analysis.',
      contact: {
        name: 'GlowMate Support',
        email: 'support@glowmate.tech',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
      {
        url: 'https://api.glowmate.tech',
        description: 'Production server',
      }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }]
  },
  // Path to the API docs
  // The apis property should point to your route files.
  apis: ['./src/routes/*.ts'], 
};

export default swaggerOptions;
