const express = require('express');
const router = express.Router();
const user = require('../controllers/auth.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', user.register);
router.post('/authenticate', user.authenticate);
router.get('/profile', jwtHelper.verifyJwtToken, user.userProfile);

router.put('/forgot', user.putForgotPw);
router.get('/reset/:token', user.getReset);
router.put('/reset/:token', user.putReset);

module.exports = router;
