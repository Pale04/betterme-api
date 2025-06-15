const express   = require('express');
const router    = express.Router();
const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = swaggerJsdoc({definition: { openapi: '3.0.3' },apis: [__filename]});
const {
  initiateVerification,
  confirmVerification,
  initiateVerificationExistent,
  confirmVerificationExistent,
} = require('../controllers/verify');

/**
 * @swagger
 * openapi: 3.0.3
 * info:
 *   title: Verification API
 *   version: 1.0.0
 *   description: Send & confirm one-time verification codes
 *
 * components:
 *   schemas:
 *     VerificationInitiate:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         birthday:
 *           type: string
 *           format: date
 *         password:
 *           type: string
 *
 *     VerificationConfirm:
 *       type: object
 *       required:
 *         - email
 *         - code
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         code:
 *           type: string
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           example: Código enviado
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           example: Error al enviar código
 *
 * tags:
 *   - name: Verification
 *     description: /initiate & /confirm
 */

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   - name: Verification
 *     description: Email verification flow
 */

/**
 * @swagger
 * /api/verify/initiate:
 *   post:
 *     summary: Send a one‐time verification code to an email
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationInitiate'
 *     responses:
 *       200:
 *         description: Code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error sending code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.post('/initiate', initiateVerification);


/**
 * @swagger
 * /api/verify/confirm:
 *   post:
 *     summary: Confirm a code and create the user account
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationConfirm'
 *     responses:
 *       200:
 *         description: User created successfully (forwards the payload from users-service)
 *       400:
 *         description: Invalid or expired code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/confirm', confirmVerification);

/**
 * @swagger
 * tags:
 *   - name: Verification
 *     description: Email verification flow
 */

/**
 * @swagger
 * /api/verify/existent/initiate:
 *   post:
 *     summary: Send a one‐time verification code to an email
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationInitiate'
 *     responses:
 *       200:
 *         description: Code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Error sending code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.post('/exitent/initiate', initiateVerificationExistent);


/**
 * @swagger
 * /api/verify/existent/confirm:
 *   post:
 *     summary: Confirm a verification code
 *     tags: [Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationConfirm'
 *     responses:
 *       200:
 *         description: Valid code
 *       400:
 *         description: Invalid or expired code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error validating code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/existent/confirm', confirmVerificationExistent);

module.exports = router;
