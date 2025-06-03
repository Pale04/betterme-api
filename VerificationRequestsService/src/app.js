let envFile;
switch (process.env.NODE_ENV) {
   case 'test':
      console.log('Test enviroment');
      envFile = '../.env.test';
      break;
   case 'production':
      console.log('Production enviroment');
      envFile = '../.env.prod';
      break;
   default:
      console.log('Development enviroment');
      envFile = '../.env.dev';
      break;
}

require('dotenv').config({
   path: require('path').resolve(__dirname, envFile)
});

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log('Established MongoDB connection'))
   .catch(err => console.error('Error while attempting to connect to MongoDB', err));

app.use(express.json()); 
app.use('/betterme/verification-requests', require('./routes/VerificationRequests'));

module.exports = app;

if (require.main === module) {
   const port = process.env.PORT;
   app.use('/betterme/verification-requests-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   console.log(`API reference available on http://localhost:${port}/betterme/verification-requests-docs`);

   if (process.env.NODE_ENV !== 'production') {
      app.use("/betterme/verification-requests/test-coverage", express.static("../coverage/lcov-report"))
      console.log(`Test coverage report available on http://localhost:${port}/betterme/verification-requests/test-coverage`);
   }

   app.listen(port, () => {
      console.log(`Server running on port ${port}`);
   });
}