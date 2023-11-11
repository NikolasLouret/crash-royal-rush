import { ObserverType, GameType, CommandFunctionGameType } from '../types/GameType'
import { ObserverEnum } from '../types/ObserverEnum'

const MAX_CRAHSES_LENTH = 25

const TIMER = 5_000

export default function createGame() {
	let observers: ObserverType[] = []
	let viewers: ObserverType[] = []

	const state: GameType = {
		crashes: [],
		gameOcurring: false,
		currentTimeCrash: 0,
		timer: 0,
		curveControll: 0,
		lastCrash: 0,
		gameStatus: '',
	}

	function subscribe(observer: ObserverType, type: ObserverEnum) {
		if (type === ObserverEnum.LOCAL) observers.push(observer)
		else if (type === ObserverEnum.ROYAL_RUSH) viewers.push(observer)
		else return false
	}

	function unsubscribe(id: string, type: ObserverEnum) {
		if (type === ObserverEnum.LOCAL) observers = observers.filter(observer => observer.id !== id)
		else if (type === ObserverEnum.ROYAL_RUSH) viewers = viewers.filter(viewer => viewer.id !== id)
		else return false
	}

	function notifyAllObservers(command: CommandFunctionGameType) {
		for (const observer of observers) {
			observer.function(command)
		}
	}
	function notifyAllViewers(command: CommandFunctionGameType) {
		for (const viewer of viewers) {
			viewer.function(command)
		}
	}

	function setupObserver() {
		return state
	}

	//*
	function setupViewer() {
		return { crashes: state.crashes, gameStatus: state.gameStatus }
	}

	//* Novo jogo
	function start() {
		state.timer = 0
		state.lastCrash = calculateTimeCrash()
		state.currentTimeCrash = 0
		state.gameOcurring = true
		state.curveControll = 0
		state.gameStatus = 'start'

		// Enviar state para front
		notifyAllObservers({ type: 'start-game', state })
		notifyAllViewers({ type: 'start-game', state: { gameStatus: state.gameStatus } })

		let startTime = new Date().getTime()
		const freq = 100

		function calculateProgress() {
			const timestamp = new Date().getTime()
			const deltaTime = (timestamp - startTime) / 1_000

			// Calculo da curva
			if (deltaTime > 10) {
				const controll = state.lastCrash / deltaTime / 15
				state.curveControll += controll
			}

			if (state.currentTimeCrash < state.lastCrash) {
				state.currentTimeCrash = deltaTime
			} else {
				clearInterval(myTimer)
				crash()
			}
		}

		const myTimer = setInterval(calculateProgress, freq)
	}

	const getCurrentCrash = () => Number((state.currentTimeCrash / 10 + 1).toFixed(2))

	function calculateTimeCrash() {
		const min = 1
		const max = 20

		return Math.random() * (max - min) + min
	}

	//* Crash
	function crash() {
		state.gameOcurring = false
		state.gameStatus = 'crashed'

		const lastCrash = Number((state.lastCrash / 10 + 1).toFixed(2))
		addNewCrash(lastCrash)

		// Enviar state para front
		notifyAllObservers({ type: 'crashed' })
		notifyAllViewers({
			type: 'crashed',
			state: {
				crashes: state.crashes,
				crash: lastCrash,
				gameStatus: state.gameStatus,
			},
		})

		let timerCount = 0

		setTimeout(() => {
			state.gameStatus = 'timer'

			notifyAllObservers({ type: 'timer', state })
			notifyAllViewers({ type: 'timer', state: { gameStatus: state.gameStatus } })

			const interval = 100
			function timer() {
				if (timerCount >= TIMER) {
					clearInterval(timing)
					timerCount = 0
				} else {
					state.timer += interval / 1000
					timerCount += interval
				}
			}

			const timing = setInterval(timer, interval)

			setTimeout(() => {
				start()
			}, 6_000)
		}, 3_000)
	}

	//* Add novos crashes
	const addNewCrash = (crash: number) => {
		const crashes = state.crashes

		if (crashes.length >= MAX_CRAHSES_LENTH) crashes.pop()

		if (!crashes.length) crashes.push(crash)
		else crashes.unshift(crash)

		state.crashes = crashes
	}

	return {
		state,
		start,
		calculateTimeCrash,
		subscribe,
		unsubscribe,
		setupViewer,
		setupObserver,
		getCurrentCrash,
	}
}
