const express = require('express');

const logoutRouter = express.Router();
logoutRouter
    .route('/')
    .get((req, res) => {
        res.clearCookie('user_id', {
        });
        res.json({
            message: 'Logged Out'
        });
    });

module.exports = logoutRouter