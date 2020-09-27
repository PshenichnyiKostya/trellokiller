const {Router} = require('express');
const {body, param} = require('express-validator');
const passport = require("passport");
const cardController = require('../controllers/card.controller');
const cardRouter = Router()
const {CARD} = require('../consts')
const Card = require('../models/Card')
const Board = require('../models/Board')

cardRouter.post('/',
    body('name')
        .exists({checkNull: true}).withMessage('Enter card name')
        .isLength(5).withMessage('Min length is 5 symbols')
    ,
    body('boardId')
        .exists().withMessage("Enter borderId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    passport.authenticate('jwt'), cardController.createCard)

cardRouter.get('/',
    body('boardId')
        .exists().withMessage("Enter borderId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    passport.authenticate('jwt'), cardController.getCards)

cardRouter.get('/:id',
    body('boardId')
        .exists().withMessage("Enter boardId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    param('id')
        .custom(value => {
            return Card.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    passport.authenticate('jwt'), cardController.getCard)

cardRouter.delete('/:id',
    body('boardId')
        .exists().withMessage("Enter borderId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    param('id')
        .custom(value => {
            return Card.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    passport.authenticate('jwt'), cardController.deleteCard)

cardRouter.patch('/:id',
    param('id')
        .custom(value => {
            return Card.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    body('boardId')
        .exists().withMessage("Enter borderId value")
        .custom(value => {
            return Board.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    body('name')
        .isLength(5).withMessage('Min length is 5 symbols'),
    body('status')
        .custom(value => {
            return Object.values(CARD.STATUS).find((status => status === value))
        }).withMessage(`Status can be ${Object.values(CARD.STATUS)}`),
    passport.authenticate('jwt'), cardController.updateCard)

module.exports = cardRouter