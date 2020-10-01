const {Schema, model} = require('mongoose');
const crypto = require("crypto");
const Board = require('./Board')

const User = new Schema({
    salt: {type: String},
    passwordHash: {type: String},
    email: {type: String, required: true, unique: true},
})

User.virtual("password")
    .set(function (password) {
        this._plainPassword = password
        if (password) {
            this.salt = crypto.randomBytes(128).toString("base64")
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, "sha1")
        } else {
            this.salt = undefined
            this.passwordHash = undefined
        }
    })
    .get(function () {
        return this._plainPassword
    })
User.methods.checkPassword = function (password) {
    if (!password) return false
    if (!this.passwordHash) return false
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, "sha1").toString() === this.passwordHash
}
// User.pre('remove', function (next) {
//     // 'this' is the client being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     Board.remove({admin: this._id}).exec();
//     Board.update({team: {"$in": [this._id]}}).exec();
//     next();
// });

User.index({ email: 'text'});
module.exports = model('User', User)