const express = require('express');
const router = express.Router();
const swaggerUI = require('swagger-ui-express');
const { isAuthenticated } = require('../middleware/middleware');
const{
    login
} = require('../controllers/authentication.js');

// router.use(isAuthenticated);    

/**
  * @swagger
  * /api/authentication/login:
  *   post:
  *     summary: Logs a user into the server generating a token for its session
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               username:
  *                 type: string
  *                 example: palestinomolina00
  *               password:
  *                 type: string
  *                 example: aBc12340+b
  *     responses:
  *       200:
  *         description: User logged in correctly
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 accessToken:
  *                   type: string
  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  *       401:
  *         description: Incorrect user credentials
  *       500:
  *         description: Server error
  */
router.post('/login', login);

module.exports = router;
