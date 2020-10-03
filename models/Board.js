const {Schema, model} = require('mongoose')
const Card = require('../models/Card')

const Board = new Schema({
    name: {type: String, require: true},
    team: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    admin: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    cards: [{type: Schema.Types.ObjectId, ref: 'Card', default: []}],
})

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