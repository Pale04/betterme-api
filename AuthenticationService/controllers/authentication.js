const { response } = require('express');
const User = require('../models/user');
const { generateToken } = require('../middleware/JWTgenerator');


const login = async (req, res = response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ msg: 'Non matching credentials' });
        }

        const payload = { id: user._id, username: user.username };
        const token = generateToken(payload);

        res.json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ msg: 'Error al iniciar sesión', error });
    }
};

module.exports = {login};