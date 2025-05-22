const express   = require('express');
const router    = express.Router();

const {
  initiateVerification,
  confirmVerification
} = require('../controllers/verify');

router.post('/initiate', initiateVerification);
router.post('/confirm', confirmVerification);

module.exports = router;
