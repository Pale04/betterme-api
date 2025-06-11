let envFile;
switch (process.env.NODE_ENV) {
   case 'production':
      console.log('Production enviroment');
      envFile = '../.env.production';
      break;
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

app.use(express.json());

app.use(cors({
  origin: 'https://localhost:5139',  
  credentials: true                  
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/users', require('./routes/users'));
app.use('/api/users/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${6969}/api/users`);
});
