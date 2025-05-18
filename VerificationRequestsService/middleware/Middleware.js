const { verifyToken } = require('./TokenVerification');

function isAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ msg: 'Token requerido' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT error →', error.message);
        return res.status(401).json({ msg: 'Token inválido o expirado', error: error.message });
    }
}

function isModerator(req, res, next) {
    const role = req.user.role;
    if (role !== 'moderator') {
        return res.status(403).json({
            msg: 'An account with moderator permissions is required'
        });
    }
    next();
}


module.exports = { isAuthenticated, isModerator };