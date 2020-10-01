const {Router} = require('express');
const {body, param} = require('express-validator');
const passport = require("passport");
const userController = require('../controllers/user.controller');
const userRouter = Router()

userRouter.get('/',
    passport.authenticate('jwt'), userController.getUsers)


module.exports = userRouter
