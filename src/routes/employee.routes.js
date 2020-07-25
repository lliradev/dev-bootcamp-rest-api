const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee.controller');

router.post('/', employee.save);
router.get('/', employee.findAll);

module.exports = router;
