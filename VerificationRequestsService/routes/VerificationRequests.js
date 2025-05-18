const express = require('express');
const { isAuthenticated, isModerator } = require('../middleware/Middleware');
const { addVerificationRequest } = require('../controllers/VerificationRequests');
const upload = require('../middleware/Multer')

const router = express.Router();

router.get('/', [isAuthenticated], [isModerator], );

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
router.post('/',  upload.fields([
   { name: 'certificate', maxCount: 1 },
   { name: 'identification', maxCount: 1 }
 ]) ,addVerificationRequest);

router.patch('/:id' [isAuthenticated], [isModerator], );

module.exports = router;