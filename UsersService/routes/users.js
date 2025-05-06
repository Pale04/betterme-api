const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../authentication/middleware');
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router.use(isAuthenticated);

/**
  * @swagger
  * /api/users:
  *   get:
  *     summary: Gets the lists of all users
  *     parameters:
  *       - name: authorization
  *         in: header
  *         description: a user token
  *         type: string
  *         required: true
  *     responses:
  *       200:
  *         description: Retrieved all users correctly
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 type: object
  *                 properties:
  *                   username:
  *                     type: string
  *                     example: johnnn
  *                   email:
  *                     type: string
  *                     example: johnDoe@example.com
  *                   usertype:
  *                     type: string
  *                     example: user
  *                   name:
  *                     type: string
  *                     example: John Doe
  *                   birthday:
  *                     type: string
  *                     format: date
  *                     example: 2000-11-20
  *       401:
  *         description: Authorization token not included, incorrect or outdated
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 msg:
  *                   type: string
  *                   example: Invalid or outdated token
  *       500:
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 msg:
  *                   type: string
  *                   example: Error while obtaining user
  */
router.get('/', getUsers);

/**
  * @swagger
  * /api/users{id}:
  *   get:
  *     summary: Gets the information of one user
  *     parameters:
  *       - name: authorization
  *         in: header
  *         description: a user token
  *         type: string
  *         required: true
  *       - name: id
  *         in: path
  *         required: true
  *     responses:
  *       200:
  *         description: Retrieved user correctly
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 username:
  *                   type: string
  *                   example: johnnn
  *                 email:
  *                   type: string
  *                   example: johnDoe@example.com
  *                 usertype:
  *                   type: string
  *                   example: user
  *                 name:
  *                   type: string
  *                   example: John Doe
  *                 birthday:
  *                   type: string
  *                   format: date
  *                   example: 2000-11-20
  *       401:
  *         description: Authorization token not included, incorrect or outdated
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 msg:
  *                   type: string
  *                   example: Invalid or outdated token
  *       404:
  *         description: User not found
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 msg:
  *                   type: string
  *                   example: User not found
  *       500: 
  *         description: Server error
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 msg:
  *                   type: string
  *                   example: Error while obtaining user
  */
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
