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
		game.start(data.state)
	})

	socket.on('crashed', data => {
		game.crashed()
	})

	socket.on('timer', data => {
		game.timer(data.state)
	})
})
