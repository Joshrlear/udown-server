const express = require('express')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
const config = require('../config')
const { createRoomName } = require('../../functions')

const textRouter = express.Router()
const jsonParser = express.json();

const nexmo = new Nexmo({
    apiKey: config.NEXMO_API_KEY,
    apiSecret: config.NEXMO_API_SECRET
}, NODE_ENV === 'production' && { debug: true })

textRouter
    .post('/', jsonParser, (req, res, next) => {

        const { username, location, userPhones } = req.body
        const roomName = createRoomName()
        const number = userPhones
        const text = `${username} is inviting you to join their event at ${location}. Use the link to join!
                      http://localhost:3000/chat/${roomName}`

        res.json({ username, roomName })


        number.map(userPhone => {
            nexmo.message.sendSms(
            '18382035015', `1${userPhone}`, text, { type: 'unicode' },
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
                        userPhone: responseData.messages[0]['to']
                    }
                    if(!res.headersSent) res.json(data)
                }
            }
        )
        })
    })

module.exports = textRouter