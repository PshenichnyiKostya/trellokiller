const {validationResult} = require("express-validator")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const config = require("config")
const passport = require("passport")
const {OAuth2Client} = require('google-auth-library')

module.exports = {
    registration: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data" + errors.array()[0].msg
                })
            }

            const {email, password, password2} = req.body
            const myErrors = []

            await User.findOne({email}).then(admin => {
                if (admin) {
                    myErrors.push({message: 'Such email exist'})
                }
            })
            if (password !== password2) {
                myErrors.push({message: "Passwords don't match"})
            }

            if (myErrors.length > 0) {
                return res.status(400).json({message: "Invalid date when registering: " + myErrors[0].message})
            } else {
                const newUser = new User({
                    email,
                    password,
                })
                const savedUser = await newUser.save()
                const payload = {
                    id: savedUser._id,
                    email: savedUser.email,
                }
                const token = jwt.sign(payload, config.get('secret'), {
                    expiresIn: "7d"
                })
                return res.status(201).json({userInfo: payload, token})
            }
        } catch (e) {
            next(e)
        }
    },
    login: async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Incorrect data" + errors.array()[0].msg
                })
            }
            await passport.authenticate("local", function (err, user) {
                if (user === false) {
                    return res.status(400).json({message: "User not exist"})
                } else {
                    const payload = {
                        id: user._id,
                        email: user.email
                    }
                    const token = jwt.sign(payload, config.get('secret'), {
                        expiresIn: "7d"
                    })
                    return res.status(200).json({userInfo: payload, token})
                }
            })(req)

        } catch (e) {
            next(e)
        }
    },
    // googleLogin: async (req, res, next) => {
    //     try {
    //         const user = req.user
    //         if (user === false) {
    //             return res.status(400).json({message: "User not exist"})
    //         } else {
    //             const payload = {
    //                 id: user._id,
    //                 email: user.email
    //             }
    //             const token = jwt.sign(payload, config.get('secret'), {
    //                 expiresIn: "7d"
    //             })
    //             console.log(token)
    //             const htmlWithEmbeddedJWT = `
    // <html>
    //   <script>
    //     // Save JWT to localStorage
    //     window.localStorage.setItem('JWT',JSON.stringify({
    //         token:${token},userId: ${user._id}
    //     }));
    //     // Redirect browser to root of application
    //     window.location.href = '/';
    //   </script>
    //
    // </html>
    // `
    //             res.send(htmlWithEmbeddedJWT);
    //         }
    //     } catch (e) {
    //         next(e)
    //     }
    // },
    googleLogin: async (req, res, next) => {
        try {

            const {tokenId} = req.body
            const client = new OAuth2Client(config.get('google_client_id'))
            const googleResponse = await client.verifyIdToken({
                idToken: tokenId,
                audience: config.get('google_client_id')
            })
            const {email_verified, email} = googleResponse.getPayload()
            if (email_verified) {
                const user = await User.findOne({email})
                let payload
                let token
                if (user) {
                    payload = {
                        id: user._id,
                        email: user.email
                    }
                    token = jwt.sign(payload, config.get('secret'), {
                        expiresIn: "7d"
                    })
                } else {
                    const newUser = new User({
                        email: email,
                        password: crypto.randomBytes(128).toString("base64"),
                    })
                    newUser.save()
                    payload = {
                        id: newUser._id,
                        email: newUser.email
                    }
                    token = jwt.sign(payload, config.get('secret'), {
                        expiresIn: "7d"
                    })
                }
                return res.status(200).json({userInfo: payload, token})
            }

        } catch (e) {
            next(e)
        }
    },


}