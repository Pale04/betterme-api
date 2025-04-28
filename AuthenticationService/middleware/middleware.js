const { verifyToken } = require('./JWTgenerator');

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
        return res.status(401).json({ msg: 'Token inválido o expirado' });
    }
}

module.exports = { isAuthenticated };