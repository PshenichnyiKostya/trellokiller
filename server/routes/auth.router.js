const {Router} = require('express');
const {check, body} = require('express-validator');
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

authRouter.post('/googlelogin',
    body('tokenId')
        .exists().withMessage('Specify tokenId'),
    authController.googleLogin)

module.exports = authRouter