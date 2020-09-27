const {validationResult} = require("express-validator")
const Board = require("../models/Board")
module.exports = {

    getBoards: async (req, res, next) => {
        try {
            const boards = await Board.find({$or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]})
            return res.status(200).json({data: boards})
        } catch (e) {
            next(e)
        }
    },
    getBoard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                })
            }
            await Board.findOne({_id: req.params.id, $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]})
                .then((board) => {
                    if (board) {
                        return res.status(200).json({data: board})
                    } else {
                        return res.status(404).json({error: "Such board not found"})
                    }
                })
        } catch (e) {
            next(e)
        }
    },
    createBoard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                })
            }

            const {name} = req.body
            const isBoard = await Board.findOne({name, admin: req.user._id})
            if (isBoard) {
                return res.status(400).json({error: "Such board name already in use"})
            }
            const board = new Board({name, admin: user._id})
            await board.save()
            return res.status(201).json({data: board._id})
        } catch (e) {
            next(e)
        }
    },
    deleteBoard: async (req, res, next) => {
        try {
            Board.deleteOne({_id: req.params.id, admin: req.user._id}).then((data) => {
                if (data.deletedCount) {
                    return res.status(204).json({data: req.params.id})
                } else {
                    return res.status(400).json({errors: "You can not delete this board"})
                }
            })
        } catch (e) {
            next(e)
        }
    },
    updateBoard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                })
            }

            const {name, userId} = req.body
            if (userId == req.user._id) {
                return res.status(400).json({error: "You can not add yourself in your team"})
            }
            const board = await Board.findOne({admin: req.user._id, _id: req.params.id})
            if (!board) {
                return res.status(404).json({error: "Board not found"})
            } else {
                if (board.team.indexOf(userId) === -1) {
                    if (userId) {
                        await board.updateOne({
                            name,
                            $push: {team: userId}
                        })
                    } else {
                        await board.updateOne({
                            name,
                        })
                    }
                    return res.status(200).json({data: board._id})
                } else {
                    return res.status(400).json({error: "User already in your team"})
                }
            }
        } catch (e) {
            next(e)
        }
    }
}
