const {Schema, model} = require('mongoose')

const Comment = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    references: [{type: Schema.Types.ObjectId, ref: 'User', defaultL: []}],
    text: {type: String, require: true},
    timestamp: {type: Date, default: new Date()},
    card: {type: Schema.Types.ObjectId, ref: 'Card', require: true},
})

Comment.pre('deleteOne',  function (next) {
    try {
        require('../models/Card').updateOne({comments: {"$in": [this._conditions._id]}}, {
            $pull: {comments: this._conditions._id}
        }).exec()
        next()
    } catch (e) {
        next(e)
    }
})

module.exports = model('Comment', Comment)