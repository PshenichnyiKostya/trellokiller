const User = require('../models/User')

module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const DEFAULT_LIMIT = 100
            const {email} = req.query
            const searchRegex = new RegExp(email)
            const users = await User.find({email: searchRegex}).select('email').limit(DEFAULT_LIMIT)
            return res.status(200).json({data: users})
        } catch (e) {
            next(e)
        }
    }
}