const express = require('express');
const mongoose = require('mongoose');
const app = express();

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());
//TODO: add database connection
// CHECK :)

const mongoDBURI = 'mongodb://localhost:27017/betterMeDB';
mongoose.connect(mongoDBURI, {})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

//TODO: import routes
// CHECK :)
app.use('/api/users', require('./routes/users'));
app.use('/api/users/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.listen(6969, () => {
    console.log('Servidor ejecutándose en http://localhost:6969');
});
