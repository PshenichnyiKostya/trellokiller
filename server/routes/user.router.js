const {Router} = require('express')
const passport = require("passport")
const {query,param} = require('express-validator')
const userController = require('../controllers/user.controller')
const userRouter = Router()
const Board = require('../models/Board')

userRouter.get('/',
    passport.authenticate('jwt'), userController.getUsers)

userRouter.get('/board/:id',
    param('id')
        .exists().withMessage("Enter boardId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    passport.authenticate('jwt'), userController.getUsersInBoard)


module.exports = userRouter
