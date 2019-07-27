const path = require('path');
const express = require('express');
const xss = require('xss');
const uuidv4 = require('uuid/v4');
const UserService = require('./users-service');
const ImageService = require('./images-service');

const profileRouter = express.Router();

const serializeImage = image => ({
    id: image.id,
    image: image,
    date_created: image.date_created,
    user_id: image.user_id
})

// CREATE: Upload image
profileRouter
    .route('/')
    .post((req, res, next) => {
        const user_id = req.signedCookies.user_id
        const image = Buffer.from(req.files.imageUpload.data).toString('base64')
        const newImage = { image, user_id }
        console.log('here', user_id)
        // no file selected
        if (!image) {
            next(new Error('No file selected'))
        }
        // Good to upload
        else {
            ImageService.createImage(
                req.app.get('db'),
                newImage
            )
            .then(image => {
                    res
                        .status(201)
            })
            .catch(next)
        }
    });

    // READ: display profile image
profileRouter
    .route('images/:user_id')
    .get((req, res, next) => {
        const user_id = req.headers.user_id
        console.log(user_id)
        
        if (!user_id) {
            next(new Error('No user id specified'))
        }
        else {
            ImageService.getImageByUser_id(
                req.app.get('db'),
                user_id
            )
            .then(image => {
                if (!image) {
                    res.status(201)
                }
                else {
                    res
                    .status(200)
                    .json(serializeImage(image))
                }
            })
        }
    })

    module.exports = profileRouter