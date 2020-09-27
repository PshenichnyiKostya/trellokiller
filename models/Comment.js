const {Schema, model} = require('mongoose');

const Comment = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    references: [{type: Schema.Types.ObjectId, ref: 'User', defaultL: []}],
    text: {type: String, require: true},
    timestamp: {type: Date, default: new Date()},
    card: {type: Schema.Types.ObjectId, ref: 'Card', require: true},
})

module.exports = model('Comment', Comment)