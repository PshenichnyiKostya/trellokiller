const User = require('../models/User')
const Board = require('../models/Board')
const {validationResult} = require("express-validator")
const mongoose = require('mongoose')

module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const DEFAULT_LIMIT = 100
            const {email} = req.query
            const searchRegex = new RegExp(email)
            const users = await User.find({
                email: {
                    $regex: searchRegex,
                    $options: "i"
                }
            }).select('email').limit(DEFAULT_LIMIT)
            return res.status(200).json({data: users})
        } catch (e) {
            next(e)
        }
    },
    getUsersInBoard: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data: " + errors.array()[0].msg
                })
            }

            const {email} = req.query
            const id = mongoose.Types.ObjectId(req.params.id)
            const searchRegex = new RegExp(email)

            const users = await Board.getUsers({
                id,
                userId: req.user._id,
                emailRegEx: searchRegex
            })
            return res.status(200).json({data: users})
        } catch (e) {
            next(e)
        }
    }

}