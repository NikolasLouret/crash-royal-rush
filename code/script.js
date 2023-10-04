document.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')
	const width = canvas.width
	const height = canvas.height
	const position = 20
	const min = 2.4
	const max = 15.7
	const crash = Math.random() * (max - min) + min

	let timerRunning = false

	function init() {
		animatePathDrawing(ctx, position, height - position, width - position, position, crash - 1)
	}

	function animatePathDrawing(ctx, startX, startY, endX, endY, crashNum) {
		let startTime = null
		let acceleration = 0

		// Variáveis para o controle da curva de Bezier
		let controlXVariance = width / 2
		let controlYVariance = height / 2

		// Coordenadas para o texto
		const textX = width / 2
		const textY = height / 2

		function step(timestamp) {
			if (startTime === null) {
				startTime = timestamp
			}

			// Calcular o progresso baseado no tempo decorrido
			const deltaTime = timestamp - startTime + acceleration
			const progress = deltaTime / 10_000

			// Aumentar a aceleração com base no progresso
			acceleration += progress * 5

			if (progress < crashNum) {
				// Limpar o canvas
				clear()

				// Ajustar a variação do controle com base no progresso
				if (progress > 1.0) {
					controlXVariance += acceleration / (progress * 100_000)
					controlYVariance += acceleration / (progress * 100_000)
				}

				// Desenhar a curva de Bezier
				drawBezierSplit(
					ctx,
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
				multiplier(textX, textY, progress)

				// Agendar o próximo quadro de animação
				window.requestAnimationFrame(step)
			} else {
				acceleration = 0

				// Limpar o canvas
				clear()

				// Desenhar a curva de Bezier
				drawBezierSplit(
					ctx,
					startX,
					startY,
					controlXVariance,
					controlYVariance,
					endX,
					endY,
					0,
					Math.min(progress, 1.0),
				)

				// Mostrar a mensagem de crash
				crashMessage(textX, textY)

				// Agendar um timer para a próxima rodada após 3 segundos
				setTimeout(() => {
					clear()

					// Desenha um timer de 5s na tela
					timer(5000)

					// Iniciar a próxima rodada
					setTimeout(() => {
						animatePathDrawing(ctx, position, height - position, width - position, position, crash - 1)
					}, 5500) // Agendar a próxima rodada após 8.5 segundos
				}, 3000) // Agendar o timer de 3 segundos para a nova rodada
			}
		}

		// Iniciar a animação
		window.requestAnimationFrame(step)
	}

	function drawBezierSplit(ctx, startX, startY, controllX, controllY, endX, endY, t0, t1) {
		ctx.beginPath()

		// Cálculos para o ponto inicial da curva de Bezier
		var t00 = t0 * t0
		var t01 = 1.0 - t0
		var t02 = t01 * t01
		var t03 = 2.0 * t0 * t01

		var nstartX = t02 * startX + t03 * controllX + t00 * endX
		var nstartY = t02 * startY + t03 * controllY + t00 * endY

		// Cálculos para o ponto final da curva de Bezier
		var t10 = t1 * t1
		var t11 = 1.0 - t1
		var t12 = t11 * t11
		var t13 = 2.0 * t1 * t11

		var nendX = t12 * startX + t13 * controllX + t10 * endX
		var nendY = t12 * startY + t13 * controllY + t10 * endY

		// Cálculos para o ponto de controle da curva de Bezier
		var ncontrollX = lerp(lerp(startX, controllX, t0), lerp(controllX, endX, t0), t1)
		var ncontrollY = lerp(lerp(startY, controllY, t0), lerp(controllY, endY, t0), t1)

		// Desenhar a curva de Bezier
		ctx.moveTo(nstartX, nstartY)
		ctx.quadraticCurveTo(ncontrollX, ncontrollY, nendX, nendY)

		ctx.stroke()
		ctx.closePath()

		// Desenhar um círculo no ponto final da curva
		ctx.beginPath()
		ctx.arc(nendX, nendY, 5, 0, 2 * Math.PI)
		ctx.fill()
	}

	/**
	 * Linearly interpolates between two numbers
	 */
	function lerp(v0, v1, t) {
		return (1.0 - t) * v0 + t * v1
	}

	function timer(timerDuration) {
		// Verificar se o timer já está em execução
		if (!timerRunning) {
			timerRunning = true

			let timerWidth = 1
			const interval = 10
			const x = width / 2
			const y = height / 2

			// Função para desenhar o timer
			function drawTimer() {
				if (timerWidth >= timerDuration) {
					clearInterval(timerInterval)
					timerRunning = false
				} else {
					// Limpar a área do timer
					ctx.clearRect(x - 125, y - 15, 250, 30)

					// Desenhar o fundo cinza
					ctx.beginPath()
					ctx.fillStyle = '#d3d3d3'
					ctx.roundRect(x - 125, y - 15, 250, 30, 5)
					ctx.fill()
					ctx.closePath()

					// Desenhar a parte preenchida em cinza escuro
					ctx.beginPath()
					ctx.fillStyle = '#c3c3c3'
					ctx.roundRect(x - 125, y - 15, timerWidth / (timerDuration / 250), 30, 5)
					ctx.fill()
					ctx.closePath()

					// Atualizar o texto do timer
					updateText((timerWidth / 1000).toFixed(1) + 's', x, y + 5, '15px Consolas')

					timerWidth += interval
				}
			}

			// Iniciar o intervalo do timer
			const timerInterval = setInterval(drawTimer, interval)
		}
	}

	function clear() {
		ctx.clearRect(0, 0, width, height)
	}

	function crashMessage(x, y) {
		ctx.beginPath()

		// Fundo do retângulo
		ctx.fillStyle = '#d3d3d3'
		ctx.roundRect(x - 75, y - 40, 150, 60, [10, 10, 0, 0])
		ctx.fill()

		// Texto do valor do crash
		updateText(crash.toFixed(2) + 'X', x, y, '30px Consolas')

		// Fundo do retângulo inferior
		ctx.fillStyle = 'gray'
		ctx.roundRect(x - 75, y + 20, 150, 30, [0, 0, 10, 10])
		ctx.fill()

		// Texto "CRASHED"
		updateText('CRASHED', x, y + 40, '15px Consolas')

		ctx.closePath()
	}

	function multiplier(x, y, progress) {
		ctx.beginPath()

		// Fundo do retângulo
		ctx.fillStyle = '#d3d3d3'
		ctx.roundRect(x - 75, y - 40, 150, 60, 10)
		ctx.fill()

		// Valor do crash
		updateText((progress + 1).toFixed(2) + 'X', x, y, '30px Consolas')

		ctx.closePath()
	}

	function updateText(text, x, y, font) {
		ctx.beginPath()

		ctx.font = font
		ctx.fillStyle = 'black'
		ctx.textAlign = 'center'
		ctx.fillText(text, x, y)

		ctx.closePath()
	}

	init()
})
