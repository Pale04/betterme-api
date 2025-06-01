function isModerator(req, res, next) {
    const role = req.user.role;
    if (role !== 'Moderator') {
        return res.status(403).json({
            msg: 'An account with moderator permissions is required'
        });
    }
    next();
}

module.exports = isModerator;