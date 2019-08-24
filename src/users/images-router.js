const express = require('express');
const ImageService = require('./images-service');

const imagesRouter = express.Router();

const serializeImage = image => ({
    id: image.id,
    image: image.image,
    date_created: image.date_created,
    user_id: image.user_id
})

imagesRouter
    .route('/:user_id')
    .get((req, res, next) => {
        const user_id = req.headers.user_id
        
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

    module.exports = imagesRouter;