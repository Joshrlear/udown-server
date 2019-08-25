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
app.use(cors())
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