const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BetterMe API - Verification Requests Service',
    version: '1.0.0',
    description: 'Handle requests for verify betterme accounts',
  },
  servers: [
    {
      url: 'http://localhost:6970',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;