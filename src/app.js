require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
//const cookieParser = require('cookie-parser')
const { NODE_ENV } = require('./config')
const fileUpload = require('express-fileupload');
//const { isLoggedIn } = require('./users/middleware')
//const loginRouter = require('./users/login-router')
//const logoutRouter = require('./users/logout-router')
const signupRouter = require('./users/signup-router')
const profileRouter = require('./users/profile-router')
const homeRouter = require('./Home/Home-Router')
const textRouter = require('./text/text-router')
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const UserService = require('./users/users-service')
const bcrypt = require('bcrypt')

const app = express();
app.use(express.json())

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    const knex = app.get('db')
    console.log('running through passport strategy')
    UserService.getUserByUsername(knex, username) 
      .then(user => {
        console.log('line 42 app.js', user)
          if (!user) { return cb(null, false); }
          //if user found, compare password using bcrypt
          bcrypt.compare(password, user.password).then(function(isSamePassword) {
            
            if (!isSamePassword) { return cb(null, false) }
            else { 
              console.log('username avaiable', user)
              return cb(null, user) 
            }
          });
          
      })
      .catch(err => {
        cb(err)
      })
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  const knex = app.get('db')
  //const field = "*"
  UserService.getUserById(knex, id)
    .then(user => {
      if (user) { cb(null, user) }
  })
  .catch(err => {
    cb(err)
  })
});

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))

/* const whitelist = [
    'https://udown-client.joshrlear.now.sh/', 
    'https://joshrlear-udown-client.now.sh/', 
    'https://udown-client-m1rhfrgv0.now.sh',
    'https://zeit.co/joshrlear/udown-client/mqnbgdj4b',
    'https://zeit.co/joshrlear/udown-client/phtqqshgj',
    'https://zeit.co/joshrlear/udown-client/fngpugudu',
    'https://zeit.co/joshrlear/udown-client/bg5tw2o3k',
    'http://localhost:3000'
]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
} */

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.

app.use(cors())
app.use(helmet())
app.use(fileUpload())

app.get('/',
  function(req, res) {
    console.log(req.user)
    res.json({ user: req.user });
  });

app.use('/home', homeRouter)
  
app.post('/login', (req, res, next) => {
  console.log(req.user)
  passport.authenticate('local', function(err, user, info) {
    console.log(user)
    if (err) { return next(err); }
    if (!user) { 
      console.log('hello')
      return res.status(401).json(); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({"user_id": user.id, "username": user.username});
    });
  })(req, res, next);
  }
);

app.get('/logout',
function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/signup', signupRouter)
app.use('/profile', profileRouter)
app.use('/text', textRouter)

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
      console.log('error message on app.js line 179:',error)
        response = { error: { message: 'server error here app.js line 180' }}
    } else {
        response = { message: error.message, error }
    }
    res.status(error.status || res.statusCode || 500)
    res.json(response)
})

module.exports = app