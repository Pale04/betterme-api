const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    usertype: {
        type: String,
        required: true,
        default: 'user'
    },
    name: {
        type: String
    },
    birthday: {
        type: Date
    }
});

module.exports = model('User', UserSchema);