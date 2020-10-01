const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const configurePassport = require("./middlewares/passport");
const config = require('config')
const mongoose = require('mongoose')
const passport = require("passport")
const authRouter = require("./routes/auth.router")
const boardRouter = require("./routes/board.router")
const cardRouter = require("./routes/card.router")
const commentRouter = require("./routes/comment.router")
const userRouter = require("./routes/user.router")

const cors = require("cors")

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

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use(cors());
app.use('/api/auth', authRouter)
app.use('/api/board', boardRouter)
app.use('/api/card', cardRouter)
app.use('/api/comment', commentRouter)
app.use('/api/user', userRouter)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({err: "Unexpected server error " + err})
});
// мои борды, имена карт, имена бордов
const PORT = config.get('port') || 5000

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on PORT ${PORT}...`)
        })
    } catch (e) {
        console.log(`Server error ${e.message}!!!`)
        process.exit(1)
    }
}

start().then()