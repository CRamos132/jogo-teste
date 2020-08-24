import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

console.log(game.state)

sockets.on('connection', socket => {
    const playerId = socket.id
    console.log(`Player connected on server with ${playerId}`)

    game.addPlayer({ playerId: playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player ${playerId} disconnected`)
    })
})

server.listen(80, () => {
    console.log(`> server listening on port: 3000`)
})