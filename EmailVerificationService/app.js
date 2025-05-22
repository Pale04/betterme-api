require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const verifyRt  = require('./routes/verify');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://localhost:5139', credentials: true }));

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/betterMeDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
}

app.use('/api/verify', verifyRt);

module.exports = app;                   

if (require.main === module) {           
  const PORT = process.env.PORT || 6971;
  app.listen(PORT, () =>
    console.log(`EmailVerifyService running on http://localhost:${PORT}`));
}
