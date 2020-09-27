const {Router} = require('express');
const {body, param} = require('express-validator');
const passport = require("passport");
const boardController = require('../controllers/board.controller');
const mongoose = require('mongoose')
const boardRouter = Router()
const User = require('../models/User')
const Board=require('../models/Board')

boardRouter.post('/',
    body('name')
        .exists({checkNull: true}).withMessage('Enter board name')
        .isLength(5).withMessage('Min length is 5 symbols')
    , passport.authenticate('jwt'), boardController.createBoard)

boardRouter.get('/', passport.authenticate('jwt'), boardController.getBoards)

boardRouter.get('/:id',
    param('id')
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    passport.authenticate('jwt'), boardController.getBoard
)

boardRouter.delete('/:id',
    param('id')
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    passport.authenticate('jwt'), boardController.deleteBoard
)

boardRouter.patch('/:id',
    param('id')
        .custom(value => {
            return mongoose.Types.ObjectId.isValid(value)
        }).withMessage('Incorrect id param'),
    body('userId')
        .optional()
        .custom(value => {
            return User.findOne({_id: value}).exec()
        }).withMessage('Incorrect userId value'),
    body('name')
        .isLength(5).withMessage('Min length is 5 symbols')
    ,
    passport.authenticate('jwt'), boardController.updateBoard
)

module.exports = boardRouter
