const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('config')
const mongoose = require('mongoose')
const passport = require("passport")
const configurePassport = require("./middlewares/passport");
const authRouter = require("./routes/auth.router")
const boardRouter = require("./routes/board.router")
const cardRouter = require("./routes/card.router")
const commentRouter = require("./routes/comment.router")

const userRouter = require("./routes/user.router")

configurePassport(passport)
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, PUT')
    next()
})

app.get('/', (req, res) => res.send('HelloWorld'))
app.use('/api/auth', authRouter)
app.use('/api/board', boardRouter)
app.use('/api/card', cardRouter)
app.use('/api/comment', commentRouter)
app.use('/api/user', userRouter)


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({err: "Unexpected server error " + err})
});

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server has been started on PORT ${process.env.PORT || 5000}...`)
        })
    } catch (e) {
        console.log(`Server error ${e.message}!!!`)
        process.exit(1)
    }
}

start().then()