const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    username: xss(user.username),
    password: xss(user.password),
    phone_number: xss(user.phone_number),
    date_created: user.date_created,
});

userRouter
    .route('/login')
    .post((req, res, next) => {
        const { username, password, phone_number } = req.body
        const newUser = { username, password, phone_number }

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body`}
                })

        UserService.createUser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(serializeUser(user))
        })
        .catch(next)
    })

userRouter
    .route('/signup')
    .post((req, res, next) => {
        const { username, password, phone_number } = req.body
        const newUser = { username, password, phone_number }

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body`}
                })

        UserService.createUser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(serializeUser(user))
        })
        .catch(next)
    })

userRouter
    .route('/profile')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UserService.getUser(knexInstance)
            .then(user => {
                res.json(user.map(serializeUser))
            })
            .catch(next)
    })