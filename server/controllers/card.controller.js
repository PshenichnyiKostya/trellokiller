const {validationResult} = require("express-validator")
const Card = require("../models/Card")
const Board = require("../models/Board")

module.exports = {
    createCard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const {name, boardId} = req.body
            const board = await Board.findOne({
                _id: boardId,
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            })
            if (!board) {
                return res.status(400).json({message: "Board not found for creating card"})
            } else {
                const isCard = await Card.findOne({name, board: board._id})
                if (isCard) {
                    return res.status(400).json({message: "Such card name already in use"})
                } else {
                    const card = new Card({name, board: board._id})
                    await card.save()
                    await Board.findOneAndUpdate({_id: board._id}, {
                        $push: {cards: card._id}
                    })
                    return res.status(201).json({data: card._id})
                }
            }
        } catch (e) {
            next(e)
        }
    },
    getCards: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            const {name, boardId} = req.query
            const searchRegex = new RegExp(name)
            const board = await Board.findOne({
                _id: boardId,
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            })
            if (!board) {
                return res.status(400).json({message: "Board not found for getting cards"})
            } else {
                const cards = await Card.find({
                    board: board._id,
                    name: {$regex: searchRegex, $options: "i"},
                }).populate({
                    path: 'comments',
                    select: 'text timestamp references user',
                    populate: {
                        path: 'references user',
                        select: 'email',
                    },

                })
                return res.status(200).json({data: cards})
            }

        } catch (e) {
            next(e)
        }
    },
    getCard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            const {boardId} = req.query
            const board = await Board.findOne({
                _id: boardId,
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            })
            if (!board) {
                return res.status(400).json({message: "Board not found for getting card"})
            } else {
                const card = await Card.findOne({_id: req.params.id, board: board._id}).populate('comments', '-card')
                if (!card) {
                    return res.status(400).json({message: "Card not found"})
                } else {
                    return res.status(200).json({data: card})
                }
            }
        } catch (e) {
            next(e)
        }
    },
    deleteCard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const board = await Board.findOne({
                _id: req.body.boardId,
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            })
            if (!board) {
                return res.status(400).json({message: "Board not found for deleting card"})
            } else {
                Card.deleteOne({_id: req.params.id}).then((data) => {
                    if (data.deletedCount) {
                        return res.status(200).json({data: req.params.id})
                    } else {
                        return res.status(400).json({errors: "You can not delete this card"})
                    }
                })
            }
        } catch (e) {
            next(e)
        }
    },
    updateCard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const {name, status, boardId} = req.body
            const board = await Board.findOne({
                _id: boardId,
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]
            }).populate('cards', 'name')

            if (!board) {
                return res.status(400).json({message: "Board not found for deleting card"})
            } else {
                if (board.cards.find(card => card.name === name && !card._id.equals(req.params.id))) {
                    return res.status(400).json({message: "This name already in use"})
                }
                await Card.findOneAndUpdate({_id: req.params.id}, {name, status}).then((card) => {
                    return res.status(200).json({data: card._id})
                })
            }
        } catch (e) {
            next(e)
        }
    }
}
