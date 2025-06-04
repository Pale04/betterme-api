const { verifyToken } = require('./JWTgenerator');

function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ msg: 'Token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT error →', error.message);
        return res.status(401).json({ msg: 'Invalid or outdated token', error: error.message });
      }
}

module.exports = { isAuthenticated };
