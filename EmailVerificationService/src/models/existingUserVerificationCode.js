const { Schema, model } = require('mongoose');

const ExistingUserVerificationCodeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    code: {
      type: String,
      required: true
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      index: { expires: 0 }   
    }
  },
  { timestamps: true }
);

module.exports = model('ExistingUserVerificationCode', ExistingUserVerificationCodeSchema);
