const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/', jwtHelper.verifyJwtToken, employee.save);
router.get('/', employee.findAll);
router.get('/:id', employee.findById);

module.exports = router;
