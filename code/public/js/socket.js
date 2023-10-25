const socket = io()

document.addEventListener('DOMContentLoaded', () => {
	let game = null

	socket.on('connect', () => {
		game = renderGame()
	})

	socket.on('setup', data => {
		game.setup(data)
	})

	socket.on('start-game', data => {
		game.start(data)
	})

	socket.on('crashed', () => {
		game.crashed()
	})

	socket.on('timer', data => {
		game.timer(data)
	})
})
