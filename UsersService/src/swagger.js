const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Betterme user service',
    version: '1.0.0',
    description: 'BetterMe service for managing users',
  },
  servers: [
    {
      url: 'http://localhost:6969',
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
