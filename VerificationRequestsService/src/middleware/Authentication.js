const { verifyToken } = require('./TokenVerification');

function isAuthenticated(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ msg: 'Token required' });
    }

    try {
        const decoded = verifyToken(authHeader.split(' ')[1]);
        req.user = decoded;
    } catch (error) {
        console.error('JWT error →', error.message);
        return res.status(401).json({ msg: 'Token inválido o expirado', error: error.message });
    }
    next();
}

module.exports = isAuthenticated;