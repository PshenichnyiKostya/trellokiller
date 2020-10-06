const {validationResult} = require("express-validator")
const Board = require("../models/Board")
const User = require("../models/User")
const {uniq, differenceWith, isEqual} = require('lodash')

module.exports = {

    getBoards: async (req, res, next) => {
        try {
            const {name} = req.query
            const searchRegex = new RegExp(name)
            const boards = await Board.find({
                $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}],
                name: {$regex: searchRegex, $options: "i"}
            }).select('-team').select('-cards')
            return res.status(200).json({data: boards})
        } catch (e) {
            next(e)
        }
    },
    getMyBoards: async (req, res, next) => {
        try {
            const {name} = req.query
            const searchRegex = new RegExp(name)
            const boards = await Board.find({
                admin: req.user._id,
                name: { $regex: searchRegex, $options: "i" }
            }).select('-team').select('-cards')
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
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            await Board.findOne({_id: req.params.id, $or: [{admin: req.user._id}, {team: {"$in": [req.user._id]}}]})
                .populate('team', 'email')
                .populate('admin', 'email')
                .then((board) => {
                    if (board) {
                        return res.status(200).json({data: board})
                    } else {
                        return res.status(404).json({message: "Such board not found"})
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
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }
            const {name} = req.body
            const isBoard = await Board.findOne({name, admin: req.user._id})
            if (isBoard) {
                return res.status(400).json({message: "Such board name already in use"})
            }
            const board = new Board({name, admin: req.user._id})
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
                    return res.status(200).json({data: req.params.id})
                } else {
                    return res.status(400).json({message: "You can not delete this board"})
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
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const {name, usersId} = req.body

            const boardByName = await Board.findOne({admin: req.user._id, name})
            if (boardByName) {
                return res.status(404).json({message: "This name already in use"})
            }
            const board = await Board.findOne({admin: req.user._id, _id: req.params.id})
            if (!board) {
                return res.status(404).json({message: "You have no permissions to do it"})
            } else {
                let usersIdArray = []
                if (usersId) {
                    usersIdArray = uniq(usersId.split(','))
                    for (let i = 0; i < usersIdArray.length; i++) {
                        if (req.user._id.equals(usersIdArray[i])) {
                            return res.status(400).json({message: "You can not add yourself to board\'s team"})
                        }
                        try {
                            await User.findById(usersIdArray[i])
                        } catch (e) {
                            return res.status(404).json({message: `User not found by ${usersIdArray[i]} id`})
                        }
                    }
                    usersIdArray = differenceWith(usersIdArray, board.team.map(value => value.toString()), isEqual)
                }
                await board.updateOne({
                    name,
                    $push: {team: {$each: usersIdArray}}
                })
                return res.status(200).json({data: board._id})

            }
        } catch (e) {
            next(e)
        }
    }
}
