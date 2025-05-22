const { Schema, model } = require('mongoose');

const VerificationCodeSchema = new Schema(
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
    payload: {
      type: Object,
      required: true         // store the full account‐creation data here
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

module.exports = model('VerificationCode', VerificationCodeSchema);
