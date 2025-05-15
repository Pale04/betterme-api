const { response } = require('express');
const Account      = require('../models/account');
const { generateToken } = require('../middleware/JWTgenerator');


const login = async (req, res = response) => {
  const { username, password } = req.body;
    
  try {
    const account = await Account.findOne({ username });

    if (!account || account.password !== password) {
        return res.status(401).json({ msg: 'Non matching credentials' });
    }

    const payload = {
      id:        account._id,
      username:  account.username,
      email:     account.email,
      userType:  account.userType
    };
    const token = generateToken(payload);   
    res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error while logging in', err });
  }
};

module.exports = { login };