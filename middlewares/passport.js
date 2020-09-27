const LocalStrategy = require("passport-local")
const passportJwt = require("passport-jwt")
const User = require('../models/User')
const jwt = require("jsonwebtoken")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const crypto = require("crypto")

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

    passport.use(new GoogleStrategy({
            clientID: config.get('google_client_id'),
            clientSecret: config.get('google_secret_key'),
            callbackURL: config.get('google_callback_url')
        },
        async function (accessToken, refreshToken, profile, done) {
            const user = await User.findOne({email: profile._json.email})
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    email: profile._json.email,
                    password: crypto.randomBytes(128).toString("base64"),
                })
                newUser.save()
                return done(null, newUser)
            }
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

}