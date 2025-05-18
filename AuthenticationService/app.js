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

// URL de conexión a MongoDB (Better Me)
const mongoDBURI = 'mongodb://localhost:27017/betterMeDB';
// Conexión a MongoDB
mongoose.connect(mongoDBURI, {})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));


app.use('/api/authentication', require('./routes/authentication'));
app.use('/api/authentication/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.listen(6968, () => {
    console.log('Servidor ejecutándose en http://localhost:6968');
});
