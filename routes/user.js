const user = require('../models/user');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const flash = require('connect-flash/lib/flash');
const {lastVisits} = require('../utils/ensurelogin');
const userController = require('../controllers/user');



router.route('/register')
.get(userController.registerUser)
.post(wrapAsync(userController.postRegister))

router.route('/login')
.get(userController.loginPage)
.post(passport.authenticate('local', { failureRedirect: '/login', failureMessage: true, failureFlash:true}),userController.loginPost); 


router.route('/logout')
.get(userController.logout);

module.exports = router