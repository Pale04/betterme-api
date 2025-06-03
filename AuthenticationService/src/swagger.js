const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Betterme login service',
    version: '1.0.0',
    description: 'BetterMe service for login using token authentication',
  },
  servers: [
    {
      url: 'http://localhost:6968',
      description: 'Servidor de desarrollo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
