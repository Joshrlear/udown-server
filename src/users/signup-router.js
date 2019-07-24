const path = require('path');
const express = require('express');
const xss = require('xss');
const bcrypt = require('bcrypt');
const UserService = require('./users-service');

const signupRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    username: xss(user.username),
    password: user.password,
    phone_number: xss(user.phone_number),
    date_created: user.date_created,
});

signupRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { username, password, phone_number } = req.body
        const newUser = { username, password, phone_number }

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
            console.log('user', user)

            // if user not found in db, create new user
            if (!user) {

                const knexInstance = req.app.get('db')

                // check valid characters via "xss", encrypt password via "bcrypt"
                bcrypt.hash(xss(password), 8)
                    .then((hash) => {
                        const user = {
                            username: username,
                            password: hash,
                            phone_number: phone_number
                        }

                        // create new user and return json
                        UserService.createUser(knexInstance, user)
                            .then(user => {
                                res
                                    .status(201)
                                    .json(serializeUser(user))
                            })
                })
            } 
            else {
                // user already exists in db
                next(new Error('Username in use'))
            }
        })
        .catch(next)
    })

    module.exports = signupRouter