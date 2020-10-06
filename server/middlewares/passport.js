const LocalStrategy = require("passport-local")
const passportJwt = require("passport-jwt")
const User = require('../models/User')
const jwt = require("jsonwebtoken")

const config = require('config')

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

module.exports = passport => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                session: false
            },
            function (email, password, done) {
                User.findOne({email}, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (!user || !user.checkPassword(password)) {
                        return done(null, false);
                    }
                    return done(null, user)
                })
            }
        )
    )

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: config.get('secret')
    };


    passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
            User.findById(payload.id, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (user) {
                    done(null, {
                        _id: user._id,
                        email: user.email,
                    })
                } else {
                    done(null, false)
                }
            })
        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

}