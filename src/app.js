require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const fileUpload = require('express-fileupload');
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
    UserService.getUserByUsername(knex, username) 
      .then(user => {
          if (!user) { return cb(null, false); }
          //if user found, compare password using bcrypt
          bcrypt.compare(password, user.password).then(function(isSamePassword) {
            
            if (!isSamePassword) { return cb(null, false) }
            else { 
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
    res.json({ user: req.user });
  });

app.use('/home', homeRouter)
  
app.post('/login', (req, res, next) => {
  console.log ('------------------------------login request:', req)
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log ('------------------------------login error:', err)
      return next(err); }
    if (!user) {
      console.log ('------------------------------user not found:')
      return res.status(401).json({errorMsg: 'Invalid login'}); }
    req.logIn(user, function(err) {
      console.log ('------------------------------user found:', user)
      if (err) { return next(err); }
      return res.json({"user_id": user.id, "username": user.username});
    });
  })(req, res, next);
  }
);

app.get('/logout',
function(req, res){
  req.logout();
});

app.use('/signup', signupRouter)
app.use('/profile', profileRouter)
app.use('/text', textRouter)

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error here app.js line 180:', error }}
    } else {
        response = { message: error.message, error }
    }
    res.status(error.status || res.statusCode || 500)
    res.json(response)
})

module.exports = app