const {Schema, model} = require('mongoose');
const {CARD} = require('../consts');
const Card = new Schema({
    name: {type: String, require: true, unique: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
    board: {type: Schema.Types.ObjectId, ref: 'Board', require: true},
    status: {
        type: String,
        enum: Object.values(CARD.STATUS),
        default: CARD.STATUS.TODO
    },
})

module.exports = model('Card', Card)