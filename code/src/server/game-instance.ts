import createGame from '../controller/game-controller'

const gameInstance = createGame()
gameInstance.start()

export { gameInstance }
