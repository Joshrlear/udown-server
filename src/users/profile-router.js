const path = require('path');
const express = require('express');
const xss = require('xss');
const uuidv4 = require('uuid/v4');
const { allowAccess } = require('./middleware')
const UserService = require('./users-service');
const ImageService = require('./images-service');

const profileRouter = express.Router();
const { createImage, getImageIdByUser_id, getImageByUser_id, updateImage } = ImageService
const { getById, getOtherUsersById, updateUser, getPhoneById } = UserService

const serializeImage = image => ({
    id: image.id,
    image: image,
    date_created: image.date_created,
    user_id: image.user_id
})

// upload image
function readOrEditImage(knex, user_id, newImage) {
    console.log('-b-b-b-b- readOrEditImage')
    if (newImage.image) {
        console.log('jjjjjj----- has new image')
        const promise = Promise.resolve(getImageIdByUser_id(knex, user_id))
        promise.then(result => {
            
            // image exists. will update with new
            if (result !== undefined) {
                const id = result.id
                updateImage(knex, id, newImage)
                    .then(res => {
                        return res.id
                    })
            }

            // no image exists. will create new
            else {
                createImage(knex, newImage)
                    .then(res => {
                        return res.id
                    })
            }
        })
    }
    
}

// upload phone
function readOrEditUser(knex, user_id, userInfo, reqType) {
    console.log('-%%%%%---- readOrEditUser')
    if (reqType === 'update') {
        if (userInfo !== null) {
            console.log('ppppppdpdpd----- has usewInfo!')
            getById(knex, user_id, 'phone_number')
                .then(result => {
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


/* app.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  }); */

// edit profile
profileRouter
    .route('/:user_id')
    .post(allowAccess, (req, res, next) => {
        console.log('profile/:user_id firing')
        require('connect-ensure-login').ensureLoggedIn()
        console.log('passing ensureLogin **********')
        //checkLoggedIn()
        const userInfo = {'phone_number': req.body.phone}
        console.log('*********$*$*$*$**$*$', userInfo)

        const user_id = req.headers.user_id
        const image_name = req.files ? req.files.image.name : null
        const image = req.files ? Buffer.from(req.files.image.data).toString('base64') : null
        const newImage = { image, image_name, user_id }
        const knex = req.app.get('db')

        // nothing to submit
       if (!image && !userInfo.phone_number) {
           console.log('^^^^^^^^^^^^^^No image and no phone_number')
            next(new Error('no new info supplied'))
        }

        else {
            console.log('TTTTTTTTTTTTT Running read/edit methods')
            Promise.resolve(readOrEditImage(knex, user_id, newImage))
            Promise.resolve(readOrEditUser(knex, user_id, userInfo, 'update'))
        }
        console.log('returning user data for EditProfile')
        return res.json()
    })

    // READ: display profile image
profileRouter
    .route('/:user_id/images')
    .get((req, res, next) => {
        console.log('profile/:user_id/images firing')
        require('connect-ensure-login').ensureLoggedIn()
        console.log('---------------still working')
        // doesn't look like this is contributing
        // it is stopping the function, don't want that
        //res.render('profile', { user: req.user })

        const user_id = req.headers.user_id
        console.log('---------------', user_id)
        if (!user_id) {
            next(new Error('No user id specified'))
        }
        else {
            getImageByUser_id(
                req.app.get('db'),
                user_id
            )
            .then(image => {
                if (!image) {
                    console.log('no image :(', image)
                    return res
                        .status(204)
                        .send({ "image": image })
                }
                else {
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
        console.log('profile/:user_id/:field firing')
        require('connect-ensure-login').ensureLoggedIn()
        //checkLoggedIn()
        const user_id = req.headers.user_id
        const field = req.headers.field
        const knex = req.app.get('db')
        console.log('id, field', user_id, field)
        
        const result = Promise.resolve(getPhoneById(knex, user_id, field))
        result.then(data => {
            console.log('returning data:', data)
            return res.send(data) 
        })
    })
        
profileRouter
    .route('/:user_id/others/:field')
    .get(allowAccess, (req, res, next) => {
        console.log('profile/:user_id/others/:field firing')
        require('connect-ensure-login').ensureLoggedIn()
        //checkLoggedIn()
        const user_id = req.headers.user_id
        const field = req.headers.field
        const knex = req.app.get('db')
        
        const result = Promise.resolve(getOtherUsersById(knex, user_id, field))
        result.then(data => {
            console.log('returning data:', data)
            return res.send(data) 
        })
    })

module.exports = profileRouter