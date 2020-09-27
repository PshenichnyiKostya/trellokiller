const {Schema, model} = require('mongoose');

const Board = new Schema({
    name: {type: String, require: true},
    team: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    admin: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    cards: [{type: Schema.Types.ObjectId, ref: 'Card', default: []}],
})

module.exports = model('Board', Board)