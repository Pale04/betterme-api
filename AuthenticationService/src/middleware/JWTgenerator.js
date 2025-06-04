const fs   = require('fs');
const path = require('path');          
const jwt  = require('jsonwebtoken');

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, '..', 'keys', 'private.key')
);
const PUBLIC_KEY  = fs.readFileSync(
  path.join(__dirname, '..', 'keys', 'public.key')
);

function generateToken(payload) {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '1h'
  });
}

function verifyToken(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256']
  });
}

module.exports = { generateToken, verifyToken };
