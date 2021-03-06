require('dotenv').config({path: __dirname + '/../.env'})

const express = require('express')
const Nexmo = require('nexmo')
const socketio = require('socket.io')
const config = require('../config')
const { NODE_ENV } = require('../config')
const { createRoomName } = require('../../functions')

const textRouter = express.Router()
const jsonParser = express.json();

const NEXMO_API_KEY = process.env.NEXMO_API_KEY;
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET;
const NEXMO_FROM_NUMBER = process.env.NEXMO_FROM_NUMBER;

const nexmo = new Nexmo({
    apiKey: NEXMO_API_KEY,
    apiSecret: NEXMO_API_SECRET,
}, {debug: true});

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
                NEXMO_FROM_NUMBER, `1${userPhone}`, text, { type: 'unicode' },
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