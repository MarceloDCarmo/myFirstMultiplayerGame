import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)

const sockets = new Server(server)

app.use(express.static('src/public'))

const game = createGame()

game.start()

game.subscribe((command) => {
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected on Server with id: ${playerId}`)

    game.addPlayer({ playerId: playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId });
        console.log(`Player ${playerId} disconnected`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

server.listen(3000, () => console.log('Server listen on port 3000'))