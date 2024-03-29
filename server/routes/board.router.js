const {Router} = require('express');
const {body, param} = require('express-validator');
const passport = require("passport");
const boardController = require('../controllers/board.controller');
const boardRouter = Router()
const Board = require('../models/Board')

boardRouter.post('/',
    body('name')
        .exists({checkNull: true}).withMessage('Enter board name')
        .isLength(5).withMessage('Min length is 5 symbols'),
    passport.authenticate('jwt'), boardController.createBoard)

boardRouter.get('/',
    passport.authenticate('jwt'), boardController.getBoards)

boardRouter.get('/my',
    passport.authenticate('jwt'), boardController.getMyBoards)

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
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    body('usersId')
        .optional()
        .isString().withMessage('Incorrect usersId value'),
    body('name')
        .isLength(5).withMessage('Min length is 5 symbols'),
    passport.authenticate('jwt'), boardController.updateBoard
)

module.exports = boardRouter
