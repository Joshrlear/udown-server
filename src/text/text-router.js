const express = require('express')
const bodyParser = require('body-parser')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
const config = require('../config')
const { createRoomName } = require('../../functions')

const textRouter = express.Router()

const nexmo = new Nexmo({
    apiKey: config.NEXMO_API_KEY,
    apiSecret: config.NEXMO_API_SECRET
}, { debug: true })

textRouter
    .route('/')
    .post((req, res, next) => {
        const { username, location } = req.headers
        const roomName = createRoomName()
        const number = '16195076807'
        const text = `${username} is inviting you to join their event at ${location}. Use the link to join!
                      http://localhost:3000/chat/${roomName}`

        res.json({ username, roomName })
        console.log('trying to send text')
        console.log(username, location, roomName)
        console.log(text)

        /* nexmo.message.sendSms(
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
        ) */
    })

module.exports = textRouter