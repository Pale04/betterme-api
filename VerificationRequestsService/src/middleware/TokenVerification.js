const fs   = require('fs');
const path = require('path');          
const jwt  = require('jsonwebtoken');

const PUBLIC_KEY  = fs.readFileSync(
  path.join(__dirname, '..', 'keys', 'public.key')
);

console.log('Public key path →', path.join(__dirname, '..', 'keys', 'public.key'));
console.log('Key file exists?', fs.existsSync(
  path.join(__dirname, '..', 'keys', 'public.key')
));

function verifyToken(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256']
  });
}

module.exports = { verifyToken };
