const {Router} = require('express');
const {check} = require('express-validator');
const passport = require("passport");
const authController = require('../controllers/auth.controller');

const authRouter = Router()

authRouter.post('/registration',
    [
        check('email', ' Incorrect email').isEmail(),
        check('password', 'Password must be at least 8 symbols').isLength({min: 8}),
        check('password2', 'Password must be at least 8 symbols').isLength({min: 8}),
    ], authController.registration
)

authRouter.post('/login',
    [
        check('email', ' Incorrect email').isEmail(),
        check('password', 'Password must be at least 8 symbols').isLength({min: 8}),
    ], authController.login)

// authRouter.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

// authRouter.get('/google/login', passport.authenticate('google',{session:false}), authController.googleLogin)

authRouter.post('/googlelogin', authController.googleLogin)

module.exports = authRouter