const { Schema, model } = require('mongoose');


const UserSchema = new Schema(
  {
    account:   {
      type: Schema.Types.ObjectId,
      ref:  'Account',
      required: true,
      unique: true,       
    },
    birthday:    {
        type: Date
    },
    description: { 
        type: String
    },
    phone:       {
        type: String
    },
    website:     {
        type: String
    },
    verified:    {
        type: Boolean, default: false
    },
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);