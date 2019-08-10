const path = require('path');
const express = require('express');
const xss = require('xss');
const uuidv4 = require('uuid/v4');
const { allowAccess } = require('./middleware')
const UserService = require('./users-service');
const ImageService = require('./images-service');

const profileRouter = express.Router();

const serializeImage = image => ({
    id: image.id,
    image: image,
    date_created: image.date_created,
    user_id: image.user_id
})

/* profileRouter
    .route('/:user_id')
    . */

// CREATE: Upload image
profileRouter
    .route('/:user_id/images')
    .post(allowAccess, (req, res, next) => {
        const user_id = req.signedCookies.user_id
        const image = Buffer.from(req.files.imageUpload.data).toString('base64')
        const newImage = { image, user_id }
        console.log('here', user_id)
        // no file selected
        if (!image) {
            console.log('no image')
            next(new Error('No file selected'))
        }
        // Good to upload
        else {
            console.log('Good to go')
            ImageService.createImage(
                req.app.get('db'),
                newImage
            )
            .then(image => {
                console.log('here')
                return res
                    .status(201)
            })
            .catch(next)
        }
    })

    // READ: display profile image
    .get(allowAccess, (req, res, next) => {
        const user_id = req.headers.user_id
        console.log(`now we're here`, user_id)
        
        if (!user_id) {
            console.log('no user_id')
            next(new Error('No user id specified'))
        }
        else {
            console.log('user id: ', user_id, 'is all good!')
            ImageService.getImageByUser_id(
                req.app.get('db'),
                user_id
            )
            .then(image => {
                if (!image) {
                    console.log('no image :(')
                    return res
                        .status(201)
                }
                else {
                    console.log('here comes that info you wanted!')
                    return res
                        .status(200)
                        .json(serializeImage(image))
                }
            })
            .catch(next)
        }
    })

    module.exports = profileRouter