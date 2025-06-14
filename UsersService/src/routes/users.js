const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');
const router = express.Router();
const { isAuthenticated } = require('../authentication/middleware');
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

/**
 * @swagger
 * openapi: 3.0.3
 * info:
 *   title: Users API
 *   version: 1.0.0
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60a7b2c8e1b3d4567890f123"
 *         username:
 *           type: string
 *           example: "foo123"
 *         email:
 *           type: string
 *           example: "foo@example.com"
 *         name:
 *           type: string
 *           example: "Foo Bar"
 *         active:
 *           type: boolean
 *           example: true
 *         userType:
 *           type: string
 *           enum: [Member, Moderator]
 *           example: Member
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60a7b2c8e1b3d4567890f456"
 *         account:
 *           $ref: '#/components/schemas/Account'
 *         birthday:
 *           type: string
 *           format: date
 *           example: "1990-05-20"
 *         description:
 *           type: string
 *           example: "Test user"
 *         phone:
 *           type: string
 *           example: "555-1234"
 *         website:
 *           type: string
 *           example: "https://foo.com"
 *         verified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid bearer token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: "Invalid or outdated token"
 *
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: "User not found"
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: "Error while processing request"
 */

// router.use(isAuthenticated);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get the List of all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve one user by account id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the account
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */


router.get('/:id', getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new account & profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Account foo123 created"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.post('/', addUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update account & profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               active:
 *                 type: boolean
 *               userType:
 *                 type: string
 *                 enum: [Member, Moderator]
 *               birthday:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', updateUser);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove account & profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the account
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User 60a7b2... deleted"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.delete('/:id', deleteUser);

module.exports = router;
