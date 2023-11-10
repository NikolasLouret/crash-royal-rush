import { io, endpoint } from '../http'
import {
	CommandFunctionGameType as CommandObserverType,
	CommandFunctionViewerType as CommandViewerType,
} from '../../types/GameType'
import { ObserverEnum } from '../../types/ObserverEnum'
import { gameInstance as game } from '../game-instance'

io.on('connection', socket => {
	const commandFunction = (command: CommandObserverType) => {
		socket.emit(command.type, command.state)
	}

	game.subscribe({ id: socket.id, function: commandFunction }, ObserverEnum.LOCAL)

	socket.emit('setup', game.setupObserver())

	socket.on('disconnect', () => {
		game.unsubscribe(socket.id, ObserverEnum.LOCAL)
	})
})

endpoint.on('connection', socket => {
	const commandFunction = (command: CommandViewerType) => {
		socket.emit(command.type, command.status)
	}

	game.subscribe({ id: socket.id, function: commandFunction }, ObserverEnum.ROYAL_RUSH)

	socket.emit('setup', game.setupViewer())

	socket.on('disconnect', () => {
		game.unsubscribe(socket.id, ObserverEnum.ROYAL_RUSH)
	})
})
