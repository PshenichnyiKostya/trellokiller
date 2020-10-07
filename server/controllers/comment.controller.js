const {validationResult} = require("express-validator")
const Board = require("../models/Board")
const Card = require("../models/Card")
const {uniq} = require('lodash')
const Comment = require("../models/Comment")
const mailService = require('../services/mailService')
const User = require('../models/User')

module.exports = {
    createComment: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const {cardId, text, references} = req.body

            const board = await Board.findOne({
                cards: {"$in": [cardId]},
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            })

            if (!board) {
                return res.status(400).json({message: "You can not post comment here"})
            } else {

                let referencesArray = []
                if (references) {
                    referencesArray = uniq(references.split(','))
                    for (let i = 0; i < referencesArray.length; i++) {
                        if (req.user._id.equals(referencesArray[i])) {
                            return res.status(400).json({message: "You can not reference to yourself"})
                        } else if (!board.admin.equals(referencesArray[i])
                            && !board.team.find(teammate => teammate._id.equals(referencesArray[i]))) {
                            return res.status(400).json({message: "Incorrect references"})
                        }
                    }
                }

                const comment = new Comment({
                    text,
                    card: cardId,
                    references: referencesArray ? referencesArray : [],
                    user: req.user._id
                })

                await comment.save()
                const card = await Card.findById(cardId)
                const options = {
                    board: board.name,
                    user: req.user.email,
                    card: card.name,
                    text,
                }
                await Card.findByIdAndUpdate(cardId, {$push: {comments: comment._id}})
                for (let i = 0; i < referencesArray.length; i++) {
                    await User.findById(referencesArray[i]).then(async user => {
                        await mailService.email.send({
                            template: 'referencesComment',
                            message: {
                                to: user.email,
                            },
                            locals: options
                        })
                    })
                }
                return res.status(201).json({data: comment._id})
            }

        } catch (e) {
            next(e)
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            const comment = await Comment.findOne({_id: req.params.id, user: req.user._id})
            if (!comment) {
                return res.status(400).json({message: "You can not delete this comment"})
            }
            await Comment.deleteOne({_id: req.params.id, user: req.user._id}).then((data) => {
                if (data.deletedCount) {
                    return res.status(200).json({data: req.params.id})
                } else {
                    return res.status(400).json({message: "You can not delete this comment"})
                }
            })
        } catch (e) {
            next(e)
        }
    },
    updateComment: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            const {text} = req.body
            await Comment.findOneAndUpdate({_id: req.params.id, user: req.user._id}, {text}).then(comment => {
                if (!comment) {
                    return res.status(404).json({message: "You can not update this comment"})
                } else {
                    return res.status(200).json({data: req.params.id})
                }
            })
        } catch (e) {
            next(e)
        }

    }
}