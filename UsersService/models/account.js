const { Schema, model } = require('mongoose');

const UserType = Object.freeze({
  MEMBER: 'Member',
  MODERATOR: 'Moderator',
});

const AccountSchema = new Schema(
  {
    username:  { type: String,
        required: true,
        unique: true 
    },
    password:  { 
        type: String,
        required: true 
    },
    email:     { 
        type: String,
        required: true,
        unique: true

    },
    name:      {
        type: String,
        required: true
    },
    active:    {
        type: Boolean,
        default: true
    },
    userType:  {
      type:    String,
      enum:    Object.values(UserType),
      default: UserType.MEMBER,
    },
  },
  { timestamps: true }
);

module.exports = model('Account', AccountSchema);