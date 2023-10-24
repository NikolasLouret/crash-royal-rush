import { io } from './http'
import { CommandFunctionType } from '../types/GameType'
import createGame from '../controller/game-instance'

const game = createGame()
game.start()

io.on('connection', (socket: any) => {
	const commandFunction = (command: CommandFunctionType) => {
		socket.emit(command.type, command)
	}

	game.subscribe({ id: socket.id, function: commandFunction })

	socket.emit('setup', game.state)

	socket.on('disconnect', () => {
		game.unsubscribe(socket.id)
	})
})
