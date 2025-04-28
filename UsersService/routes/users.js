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

// This shii is the middleware method for tokens,
// if you guys need to dont have this just coment it
router.use(isAuthenticated);   

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
