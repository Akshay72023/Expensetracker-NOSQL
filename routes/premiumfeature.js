const express = require('express');
const router = express.Router();
const premiumControllers = require('../controllers/premiumfeature');
const authentication = require('../middleware/authentication');

router.get('/showleaderboard', authentication.authenticate, premiumControllers.getLeaderBoard);

module.exports = router;
