const path = require('path');
const express = require('express');
const xss = require('xss');
const bcrypt = require('bcrypt');
const UserService = require('./users-service');

const loginRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    username: xss(user.username),
    password: xss(user.password),
    phone_number: xss(user.phone_number),
    date_created: user.date_created,
});

loginRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const newUser = { username, password }
        
        // check for empty fields
        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body`}
                })
        // if all fields exist, check username in db
        UserService.getUserByUsername(
            req.app.get('db'), 
            username
            )
            .then(user => {
                // user found
                if (user) {
                    bcrypt
                        .compare(password, user.password)
                        .then((result) => {
                            // password matches
                            if (result) {
                                // setting "set-cookie" header
                                const isSecure = req.app.get('env') != 'development'
                                res.cookie('user_id', user.id, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                })
                                res.json({
                                    id: user.id,
                                    message: 'Logged in!'
                                }) 
                            }
                            // password doesn't match
                            else {
                                next(Error('Invalid login'))
                            }
                        })
                } 
                // user not found
                else {  
                    next(Error('Invalid login'))
                }
                
            })
    })


module.exports = loginRouter