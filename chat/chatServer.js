const io = require('socket.io')(5000)

io.on('connection', socket => {
    socket.emit('chat_message', 'Hello there!')
    console.log('Chat Server listening at http://localhost:5000')
})