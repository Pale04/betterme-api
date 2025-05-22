const express = require('express');
const isModerator  = require('../middleware/RolVerification');
const isAuthenticated = require('../middleware/Authentication');
const { 
  getVerificationRequests, 
  getVerificationRequestDocument, 
  addVerificationRequest, 
  evaluateVerificationRequest 
} = require('../controllers/VerificationRequests');
const upload = require('../middleware/Multer')

const router = express.Router();

/**
 * @swagger
 * /betterme/verification-requests:
 *    get:
 *       summary: Get verification requests with pagination and orderes by date
 *       tags: [Verification Request]
 *       requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      count:
 *                         type: integer
 *                         example: 10
 *                      cursor:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-18
 *       responses:
 *          200:
 *             description: The verification requests were sent correctly  
 *          400:
 *             description: Incorrect request body
 *          401:
 *             description: Incorrect token or expired token
 *          403:
 *             description: The user doesn't has the required role
 *          500:
 *             description: Server error       
 */
router.get('/', [isAuthenticated], [isModerator], getVerificationRequests);

/**
 * @swagger
 * /betterme/verification-requests/uploads/{fileName}:
 *    get:
 *       summary: Get the required document of a verification request
 *       tags: [Verification Request]
 *       parameters:
 *        - in: path
 *          name: fileName
 *          required: true
 *          schema:
 *            type: string
 *          description: name of the requiered document
 *       responses:
 *          200:
 *             description: The document was sent correctly  
 *          400:
 *             description: The file name parameter is missing
 *          401:
 *             description: Incorrect token or expired token
 *          403:
 *             description: The user doesn't has the required role
 *          404:
 *             description: The required document was not found   
 */
router.get('/uploads/:fileName', [isAuthenticated], [isModerator], getVerificationRequestDocument);

/**
 * @swagger
 * /betterme/verification-requests:
 *    post:
 *       summary: Add a new verification request
 *       tags: [Verification Request]
 *       requestBody:
 *          required: true
 *          content:
 *             multipart/form-data:
 *                schema:
 *                   type: object
 *                   properties:
 *                      certificate:
 *                         type: string
 *                         format: binary
 *                      identification:
 *                         type: string
 *                         format: binary
 *       responses:
 *          201:
 *             description: The verification request was created correctly  
 *          400:
 *             description: Incorrect request body
 *          401:
 *             description: Incorrect token or expired token
 *          409:
 *             description: User already has a pending verification request
 *          500:
 *             description: Server error       
 */
router.post('/', [isAuthenticated], upload.fields([
   { name: 'certificate', maxCount: 1 },
   { name: 'identification', maxCount: 1 }
 ]), addVerificationRequest);

 /**
 * @swagger
 * /betterme/verification-requests/{id}:
 *    patch:
 *       summary: Update the verification request status
 *       tags: [Verification Request]
 *       parameters:
 *        - in: id
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: id of the verification request
 *       requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      approved:
 *                         type: boolean
 *                         example: true
 *       responses:
 *          200:
 *             description: The verification request was created correctly  
 *          400:
 *             description: Incorrect id parameter or request body
 *          401:
 *             description: Incorrect token or expired token
 *          403:
 *             description: The user doesn't has the required role
 *          409:
 *             description: Verification request is already evaluated
 *          500:
 *             description: Server error       
 */
router.patch('/:id', [isAuthenticated], [isModerator], evaluateVerificationRequest);

module.exports = router;