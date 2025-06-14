let envFile;
switch (process.env.NODE_ENV) {
  case 'production':
    console.log('Production environment');
    envFile = '../.env.production';
    break;
  default:
    console.log('Development environment');
    envFile = '../.env.development';
}

require('dotenv').config({
  path: require('path').resolve(__dirname, envFile)
});

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const verifyRt = require('./routes/verify');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://localhost:5139', credentials: true }));

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
}

app.use('/api/verify', verifyRt);

// export for testing
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`EmailVerifyService running on http://localhost:${PORT}/api/verify`)
  );
}
