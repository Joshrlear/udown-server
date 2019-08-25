require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { NODE_ENV } = require('./config')
const fileUpload = require('express-fileupload');
const { isLoggedIn } = require('./users/middleware')
const loginRouter = require('./users/login-router')
const logoutRouter = require('./users/logout-router')
const signupRouter = require('./users/signup-router')
const profileRouter = require('./users/profile-router')
const homeRouter = require('./Home/Home-Router')
const textRouter = require('./text/text-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))

const whitelist = [
    'https://udown-client.joshrlear.now.sh/', 
    'https://joshrlear-udown-client.now.sh/', 
    'https://udown-client-m1rhfrgv0.now.sh',
    'https://zeit.co/joshrlear/udown-client/mqnbgdj4b',
    'https://zeit.co/joshrlear/udown-client/phtqqshgj',
    'https://zeit.co/joshrlear/udown-client/fngpugudu',
    'https://zeit.co/joshrlear/udown-client/bg5tw2o3k'
]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(fileUpload())
app.use(cookieParser(process.env.COOKIE_SECRET))


app.use('/isLoggedIn', (req, res, next) => {
    if (req.signedCookies.user_id == req.headers.user_id) {
        res.json({ 'isLoggedIn': true })
    }
    else { res.json({ 'isLoggedIn': false })}
})

app.use('/home', homeRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/signup', signupRouter)
app.use('/profile', isLoggedIn, profileRouter)
app.use('/text', textRouter)

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { message: error.message, error }
    }
    res.status(error.status || res.statusCode || 500)
    res.json(response)
})

module.exports = app