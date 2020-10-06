const nodemailer = require('nodemailer')
const Email = require('email-templates')
const config = require('config')

const transporter = nodemailer.createTransport(
    config.get('email_transport'),
    config.get('email_config')
)

module.exports.email = new Email({
    transport: transporter,
    send: true,
    preview: false,
    views: {
        root: './templates'
    }
})