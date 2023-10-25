const TIMER = 5_000

const canvas = createCanvas()

function renderGame() {
	let progress = 0
	let crashTime = 0
	let currentCrash = 0

	const start = state => {
		crashTime = state.lastCrash
		currentCrash = state.currentTimeCrash

		animatePathDrawing(0, canvas.height, canvas.width - 30, 30, crashTime)
	}

	function setup(state) {
		canvas.clear()
		crashTime = state.lastCrash
		currentCrash = state.currentTimeCrash
		const controll = state.curveControll * 10

		let controlXVariance = canvas.width / 2
		let controlYVariance = canvas.height / 2

		if (currentCrash > 30.0) {
			controlXVariance += controll
		} else {
			controlXVariance += controll
			controlYVariance += controll
		}

		if (state.isCrashed) {
			if (!state.timer) {
				canvas.drawBezierSplit(
					0,
					canvas.height,
					controlXVariance,
					controlYVariance,
					canvas.width - 30,
					30,
					0,
					1.0,
				)
				canvas.crashMessage(currentCrash / 10 + 1)
			} else timer(state)
		} else {
			animatePathDrawing(0, canvas.height, canvas.width - 30, 30, crashTime, controll)
		}
	}

	function timer(state) {
		canvas.clear()
		canvas.timer(TIMER, state.timer)
	}

	function animatePathDrawing(startX, startY, endX, endY, crashNum, curveControll) {
		let startTime = new Date().getTime()
		let teste = 0

		let teste = 0
		// Variáveis para o controle da curva de Bezier
		let controlXVariance = canvas.width / 2 + (curveControll || 0)
		let controlYVariance = canvas.height / 2 + (curveControll || 0)

		async function step() {
			const timestamp = new Date().getTime()

			// Calcular o progresso baseado no tempo decorrido
			const deltaTime = timestamp - startTime + (currentCrash ? currentCrash * 1_000 : 0)
			const currentTime = deltaTime / 1_000
			progress = currentTime / 10

			const controll = crashTime / currentTime / 15
			// teste += progress + 1 / controll
			// console.log(teste)

			if (currentTime < crashNum) {
				// Limpar o canvas
				canvas.clear()

				// Ajustar a variação do controle com base no progresso
				if (progress > 1.0) {
					if (progress > 3) {
						controlXVariance += controll / 3
					} else {
						controlXVariance += controll
						controlYVariance += controll
					}
				}

				// Desenhar a curva de Bezier
				canvas.drawBezierSplit(
					startX,
					startY,
					controlXVariance,
					controlYVariance,
					endX,
					endY,
					0,
					Math.min(progress, 1.0),
				)

				// Mostrar o texto com base no progresso
				canvas.multiplier(progress + 1)

				// Agendar o próximo quadro de animação
				window.requestAnimationFrame(step)
			}
		}

		// Iniciar a animação
		window.requestAnimationFrame(step)
	}

	function crashed() {
		// Mostrar a mensagem de crash
		canvas.crashMessage(progress + 1)
		progress = 0
	}

	return {
		setup,
		start,
		crashed,
		timer,
	}
}
