let envFile;
switch (process.env.NODE_ENV) {
  case 'production':
    console.log('Production enviroment');
    envFile = '../.env.production';
    break;
  case 'test':
    console.log('Test enviroment');
    envFile = '../.env.test.local'
  default:
    console.log('Development enviroment');
    envFile = '../.env.development';
    break;
}

require('dotenv').config({
  path: require('path').resolve(__dirname, envFile)
});

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(cors({
  origin: 'https://localhost:5139',  
  credentials: true                  
}));
app.use('/api/authentication', require('./routes/authentication'));
app.use('/api/authentication/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT;
  app.listen(port, () => {
      console.log(`Servidor ejecutándose en http://localhost:${port}/api/authentication`);
  });
}

