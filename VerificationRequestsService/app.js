require('dotenv').config({
   path: require('path').resolve(__dirname, "./.env")
});
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.err('Error al conectar a MongoDB',err));

app.use('/betterme/verification-requests-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/betterme/verification-requests', require('./routes/VerificationRequests'));

const port = process.env.PORT;
app.listen(port, () => {
   console.log('Servidor ejecutándose en el puerto ${puerto}');
   console.log('Documentación disponible en: http:/localhost:6970/betterme/verification-requests-docs')
});