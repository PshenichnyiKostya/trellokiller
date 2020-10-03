const {Schema, model} = require('mongoose');
const crypto = require("crypto");

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

module.exports = model('User', User)