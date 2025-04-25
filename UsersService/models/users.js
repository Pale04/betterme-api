const { Schema, model } = require('mongoose');


// DISCLAIMER!!!
// k guys so mmm i just made this shi like fast and i think
// this scheme might change later cause of account and that
// but i think like this is helpfull for eraly versions
// and like made it just like on the api spec that we made so cant blame me kekw 

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