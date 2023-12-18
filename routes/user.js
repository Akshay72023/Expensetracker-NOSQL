const express = require('express');
const signupController = require('../controllers/user');
const router = express.Router();

router.post('/signup', signupController.postSignup);
router.post('/login',signupController.postLogin);

module.exports = router;
