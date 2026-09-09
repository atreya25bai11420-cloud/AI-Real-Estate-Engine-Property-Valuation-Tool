const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PropTech Real-Time Property Intelligence API',
      version: '1.0.0',
      description: 'High-performance property valuation engine with dynamic market trend integration and JWT authentication.'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJSDoc(options);
