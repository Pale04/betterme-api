const envFile = (process.env.NODE_ENV !== 'test') ? '../.env' : '../.env.test';

require('dotenv').config({
   path: require('path').resolve(__dirname, envFile)
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

app.use("/betterme/verification-requests/test-coverage", express.static("../coverage/lcov-report"))
app.use('/betterme/verification-requests-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/betterme/verification-requests', require('./routes/VerificationRequests'));

module.exports = app;

if (require.main === module) {
   const port = process.env.PORT;
   app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API reference available on http://localhost:${port}/betterme/verification-requests-docs`);
      console.log(`Test coverage report available on http://localhost:${port}/betterme/verification-requests/test-coverage`);
   });
}