const knex = require('knex')
const app = require('./app')
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const uuid = require('uuid/v4')

const { PORT, DB_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
  })

io.on('connection', socket => {
  
  socket.on('join_room', data => {
    console.log(`joining chat at: ${data.room}`)

    // it's looping through twice for some reason
    socket.join(data.room, () => {
      console.log('user: ', data.user)
      io.to(data.room).emit(`${data.username} has joined`)
    })
    // I want to display location name and address
    // at the top of chat so that it is obvious what
    // location is on topic as well as having a link
    // to the address that when click opens google navigation

    //io.to(data.room).emit(`Chat started for:\n${data.loc.name}\n${data.loc.address}`)
  })
  
  socket.on('chat_message', ({ room, username, message }) => {
    socket.to(room).emit('chat_message', {
      username,
      message,
    })
  })

  socket.on('typing', user => {
    socket.broadcast.emit('typing', user)
  })
  console.log(`Chat Server listening at http://localhost:${PORT}`)
})