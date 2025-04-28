const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/middleware');
const{
    login
} = require('../controllers/authentication.js');

// router.use(isAuthenticated);    

router.post('/login', login);
module.exports = router;