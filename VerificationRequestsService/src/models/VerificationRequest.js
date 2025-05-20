const { Schema, model } = require('mongoose');

const VerificationRequestSchema = Schema({
   userId: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now
    },
    certificateUrl: {
      type: String,
      required: true
    },
    identificationUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Denied'],
      default: 'Pending'
    }
});

module.exports = model('VerificationRequest', VerificationRequestSchema);