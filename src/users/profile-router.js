const path = require('path');
const express = require('express');
const xss = require('xss');
const uuidv4 = require('uuid/v4');
const { allowAccess } = require('./middleware')
const UserService = require('./users-service');
const ImageService = require('./images-service');

const profileRouter = express.Router();
const { createImage, getImageIdByUser_id, getImageByUser_id, updateImage } = ImageService
const { getById, getOtherUsersById, updateUser } = UserService

const serializeImage = image => ({
    id: image.id,
    image: image,
    date_created: image.date_created,
    user_id: image.user_id
})

// upload image
function readOrEditImage(knex, user_id, newImage) {
    if (newImage.image) {
        const promise = Promise.resolve(getImageIdByUser_id(knex, user_id))
        promise.then(result => {
            
            // image exists. will update with new
            if (result !== undefined) {
                const id = result.id
                console.log('updates image with id:', id)
                updateImage(knex, id, newImage)
                    .then(res => {
                        // res will give image base64 which is too much to log
                        console.log(res.id)
                        return res.id
                    })
            }

            // no image exists. will create new
            else {
                console.log('uploads new image')
                createImage(knex, newImage)
                    .then(res => {
                        // res will give image base64 which is too much to log
                        console.log(res.id)
                        return res.id
                    })
            }
        })
    }
    else { console.log('upload only phone') }
    
}

// upload phone
function readOrEditUser(knex, user_id, userInfo, reqType) {
    console.log('running phone upload:', `---${userInfo}---`)
    // if statement not currently working. autofilling phone value with
    // user current phone so that when the submit without changing
    // it will overwrite phone with same value
    if (reqType === 'update') {
        if (userInfo !== null) {
            console.log('before the promise')
            getById(knex, user_id, 'phone_number')
                .then(result => {
                    console.log('something/..................')
                    console.log('update empty field(phone) to:', userInfo)
                    updateUser(knex, user_id, userInfo)
                        .then(data => {
                            console.log(data)
                        })

                })
                .then(res => {
                    if(!res.ok) {
                        return res.json().then(err => {
                            throw err
                        })
                    }
                    else {
                        console.log('loggin somethinhere./........')
                        return res
                            .status()
                            .json()
                    }
                })
                .catch(err => {
                    new Error(err)
                })
        }
        else { console.log('upload only image') }
    }
    else if (reqType === 'get') {
        if (userInfo) {
            const promise = Promise.resolve(getUserInfoById(knex, user_id, userInfo))
            promise.then(result => {
                if(!result) {
                    return result.json().then(err => {
                        throw err
                    })
                }
                else {
                    return res
                        .status()
                        .json()
                }
            })
            .catch(err => {
                new Error(err)
            })
        }
    }
        
}

// edit profile
profileRouter
    .route('/:user_id')
    .post(allowAccess, (req, res, next) => {
        //console.log('body is:', req)
        const userInfo = {'phone_number': req.body.phone}
        //console.log(phone, req.body.phone)
        //console.log('image name:', req.files.image.name)
        const user_id = req.signedCookies.user_id
        const image_name = req.files ? req.files.image.name : null
        const image = req.files ? Buffer.from(req.files.image.data).toString('base64') : null
        const newImage = { image, image_name, user_id }
        const knex = req.app.get('db')

        // nothing to submit
       if (!image && !userInfo.phone_number) {
            console.log('no new info supplied')
            next(new Error('no new info supplied'))
        }

        else {
            
            Promise.resolve(readOrEditImage(knex, user_id, newImage))
            Promise.resolve(readOrEditUser(knex, user_id, userInfo, 'update'))
        }
        return res.json()
    })

    // not working
    /* .get(allowAccess, (req, res, next) => {

        console.log(`------------------getting ${req}`)
        return res.json()
        
    }) */

    // READ: display profile image
profileRouter
    .route('/:user_id/images')
    .get(allowAccess, (req, res, next) => {
        const user_id = req.headers.user_id
        
        if (!user_id) {
            //console.log('no user_id')
            next(new Error('No user id specified'))
        }
        else {
            //console.log('user id: ', user_id, 'is all good!')
            getImageByUser_id(
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
                    console.log('sending over image')
                    return res
                        .status(200)
                        .json(serializeImage(image))
                }
            })
            .catch(next)
        }
    })

profileRouter
    .route('/:user_id/:field')
    .get(allowAccess, (req, res, next) => {
        const user_id = req.headers.user_id
        const field = req.headers.field
        const knex = req.app.get('db')
        
        const result = Promise.resolve(getById(knex, user_id, field))
        result.then(data => { 
            return res.send(data) 
        })

        /* return (
            user_id 
                && (field
                && (getById(knex, user_id, field))
            ) 
        )*/
    })
        
profileRouter
    .route('/:user_id/others/:field')
    .get(allowAccess, (req, res, next) => {
        const user_id = req.headers.user_id
        const field = req.headers.field
        const knex = req.app.get('db')
        
        const result = Promise.resolve(getOtherUsersById(knex, user_id, field))
        result.then(data => { 
            return res.send(data) 
        })
    })

    module.exports = profileRouter