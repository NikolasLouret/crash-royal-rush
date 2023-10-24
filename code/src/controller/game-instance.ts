import { ObserverType, GameType, CommandFunctionType } from '../types/GameType'

const TIMER = 5_000

export default function createGame() {
	let observers: ObserverType[] = []

	const state: GameType = {
		timeCrash: 0,
		isCrashed: false,
		currentTimeCrash: 0,
		timer: 0,
		curveControll: 0,
	}

	function subscribe(viewer: ObserverType) {
		observers.push(viewer)
	}

	function unsubscribe(id: string) {
		observers = observers.filter(viewer => viewer.id !== id)
	}

	function notifyAll(command: CommandFunctionType) {
		for (const viewer of observers) {
			viewer.function(command)
		}
	}

	function start() {
		state.timer = 0
		state.timeCrash = calculateTimeCrash()
		state.currentTimeCrash = 0
		state.isCrashed = false
		state.curveControll = 0

		// Enviar state para front
		notifyAll({ type: 'start-game', state })

		let startTime = new Date().getTime()
		const freq = 100

		function calculateProgress() {
			const timestamp = new Date().getTime()
			const deltaTime = (timestamp - startTime) / 1_000

			// Calculo da curva
			if (deltaTime > 10) {
				const controll = state.timeCrash / deltaTime / 10
				state.curveControll += controll
			}

			if (state.currentTimeCrash < state.timeCrash) {
				state.currentTimeCrash = deltaTime
			} else {
				clearInterval(myTimer)
				crash()
			}
		}

		const myTimer = setInterval(calculateProgress, freq)
	}

	function calculateTimeCrash() {
		const min = 1
		const max = 50

		return Math.random() * (max - min) + min
	}

	function crash() {
		state.isCrashed = true

		// Enviar state para front
		notifyAll({ type: 'crashed', state })

		let timerCount = 0

		setTimeout(() => {
			notifyAll({ type: 'timer', state })
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

	return {
		state,
		start,
		calculateTimeCrash,
		subscribe,
		unsubscribe,
	}
}
