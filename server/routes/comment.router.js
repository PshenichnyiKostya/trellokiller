const {Router} = require('express');
const {body, param} = require('express-validator');
const passport = require("passport");
const commentController = require('../controllers/comment.controller');
const commentRouter = Router()
const Card = require('../models/Card')
const Comment = require('../models/Comment')

commentRouter.post('/',
    body('text')
        .exists().withMessage('Enter text')
        .isLength({min: 2, max: 255}).withMessage('Text could be 2-255 symbols')
        .isString().withMessage('Incorrect text'),
    body('cardId')
        .exists().withMessage("Enter cardId value")
        .custom(value => {
            return Card.findOne({_id: value}).exec()
        }).withMessage('Incorrect boardId value'),
    body('references')
        .optional()
        .isString().withMessage('Incorrect references value'),
    passport.authenticate('jwt'), commentController.createComment)

commentRouter.delete('/:id',
    param('id')
        .custom(value => {
            return Comment.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),

    passport.authenticate('jwt'), commentController.deleteComment)

commentRouter.patch('/:id',
    param('id')
        .custom(value => {
            return Comment.findOne({_id: value}).exec()
        }).withMessage('Incorrect id param'),
    body('text')
        .exists().withMessage('Enter text')
        .isLength({min: 2, max: 255}).withMessage('Text could be 2-255 symbols')
        .isString().withMessage('Incorrect text'),
    passport.authenticate('jwt'), commentController.updateComment)

module.exports = commentRouter