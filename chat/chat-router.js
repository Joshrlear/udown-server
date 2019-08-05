const config = require('../src/config')

const socket = io(`${config.CHAT_PORT}`)

socket.on('chat_message', data => {
    console.log(data)
})