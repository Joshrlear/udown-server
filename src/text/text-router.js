const express = require('express')
const bodyParser = require('body-parser')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
const config = require('../config')

const textRouter = express.Router()

const nexmo = new Nexmo({
    apiKey: config.NEXMO_API_KEY,
    apiSecret: config.NEXMO_API_SECRET
}, { debug: true })

textRouter
    .route('/')
    .post((req, res, next) => {
        const number = '16195076807'
        const text = 'Test message from Nexmo and Nodejs!'
        console.log('trying to send text')

        nexmo.message.sendSms(
            '18382035015', number, text, { type: 'unicode' },
            (err, responseData) => {
                if (err) {
                    console.log(err)
                    next(err)
                }
                else {
                    console.log('message sent successfully to: ', responseData.messages[0].to)

                    // send data to client
                    const data = {
                        id: responseData.messages[0]['message-id'],
                        number: responseData.messages[0]['to']
                    }
                    return res.send(data)
                }
            }
        )
    })

module.exports = textRouter