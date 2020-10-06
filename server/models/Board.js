const {Schema, model} = require('mongoose')
const Card = require('./Card')

const Board = new Schema({
    name: {type: String, require: true},
    team: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    admin: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    cards: [{type: Schema.Types.ObjectId, ref: 'Card', default: []}],
})

const getPipeLineForUsersByBoardIdAndEmail = ({id, userId, emailRegEx}) => {
    return [
        {
            $match: {
                $and: [
                    {_id: id},
                    {$or: [{admin: userId}, {team: {"$in": [userId]}}]}]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "team",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $group: {
                _id: "$_id",
                user: {$first: "$user"}
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                'user.email': {$regex: emailRegEx, $options: "i"}
            }
        },
        {
            $project: {
                _id: 0, 'user.email': 1, 'user._id': 1
            }
        },
        {
            $group: {
                _id: "$user._id",
                email: {$first: "$user.email"}
            }
        },
    ]
}

Board.statics.getUsers = function (params) {
    return this.aggregate(getPipeLineForUsersByBoardIdAndEmail(params))
}

Board.pre('deleteOne', function (next) {
    try {
        Card.find({board: this._conditions._id}).then(cards => {
            if (cards) {
                cards.forEach(card => {
                    Card.deleteOne({_id: card._id}).exec()
                })
            }
            next()
        })
    } catch (e) {
        next(e)
    }
})

module.exports = model('Board', Board)