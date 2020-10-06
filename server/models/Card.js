const {Schema, model} = require('mongoose')
const {CARD} = require('../consts')
const Comment = require('./Comment')

const Card = new Schema({
    name: {type: String, require: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
    board: {type: Schema.Types.ObjectId, ref: 'Board', require: true},
    status: {
        type: String,
        enum: Object.values(CARD.STATUS),
        default: CARD.STATUS.TODO
    },
})

Card.pre('deleteOne',  function (next) {
    try {
        require('./Board').updateOne({cards: {"$in": [this._conditions._id]}}, {
            $pull: {cards: this._conditions._id}
        }).exec()
        Comment.deleteMany({card: this._conditions._id}).exec()
        next()
    } catch (e) {
        next(e)
    }
})

module.exports = model('Card', Card)