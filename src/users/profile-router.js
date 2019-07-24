const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');

const profileRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
    id: user.id,
    username: xss(user.username),
    password: xss(user.password),
    phone_number: xss(user.phone_number),
    date_created: user.date_created,
});

profileRouter
    .route('/')
    .get((req, res, next) => {
        console.log('running')
        const knexInstance = req.app.get('db')
        UserService.getUser(knexInstance)
            .then(user => {
                res.json(user.map(serializeUser))
            })
            .catch(next)
    })

    module.exports = profileRouter