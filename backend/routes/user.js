const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
// importation du middleware-passwords-validator

const passwords = require('../middleware/password');

router.post('/signup', passwords, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;