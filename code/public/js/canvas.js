const BG_PRIMARY = '#282828'
const BG_SECONDARY = '#434343'
const YELLOW_PRIMARY = '#FFCA10'
const YELLOW_SECONDARY = '#FFB800'
const WHITE = '#FFF'

function createCanvas() {
	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')
	const width = canvas.width
	const height = canvas.height
	const positionX = width / 2
	const positionY = height / 2

	function drawBezierSplit(startX, startY, controllX, controllY, endX, endY, t0, t1) {
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

		ctx.lineWidth = 15
		ctx.strokeStyle = YELLOW_SECONDARY
		ctx.lineCap = 'round'
		ctx.stroke()
		ctx.closePath()

		// Desenhar um círculo no ponto final da curva
		ctx.beginPath()
		ctx.fillStyle = YELLOW_PRIMARY
		ctx.arc(nendX, nendY, 30, 0, 2 * Math.PI)
		ctx.fill()
	}

	/**
	 * Linearly interpolates between two numbers
	 */
	function lerp(v0, v1, t) {
		return (1.0 - t) * v0 + t * v1
	}

	function timer(timerDuration, timerStarts) {
		let timerWidth = timerStarts * 1000 || 1
		const interval = 10

		// Função para desenhar o timer
		function drawTimer() {
			if (timerWidth >= timerDuration) {
				clearInterval(timerInterval)
			} else {
				// Limpar a área do timer
				canvas.clear()

				// Desenhar o fundo cinza
				ctx.beginPath()
				ctx.fillStyle = BG_SECONDARY
				ctx.roundRect(positionX - (width - 200) / 2, positionY - 70, width - 200, 140, 10)
				ctx.fill()
				ctx.closePath()

				// Desenhar a parte preenchida em amarelo
				ctx.beginPath()
				ctx.fillStyle = YELLOW_PRIMARY
				ctx.roundRect(
					positionX - (width - 250) / 2,
					positionY - 50,
					timerWidth / (timerDuration / (width - 250)),
					100,
					10,
				)
				ctx.fill()
				ctx.closePath()

				// Atualizar o texto do timer
				updateText((timerWidth / 1000).toFixed(1) + 's', positionX, positionY + 30, WHITE, '100px Consolas')

				timerWidth += interval
			}
		}

		// Iniciar o intervalo do timer
		const timerInterval = setInterval(drawTimer, interval)
	}

	function clear() {
		ctx.clearRect(0, 0, width, height)
	}

	function crashMessage(crash) {
		ctx.beginPath()

		// Fundo do retângulo
		ctx.fillStyle = YELLOW_PRIMARY
		ctx.roundRect(positionX - 200, positionY - 160, 400, 200, [10, 10, 0, 0])
		ctx.fill()

		// Texto do valor do crash
		updateText(crash.toFixed(2) + 'X', positionX, positionY - 30, WHITE, '100px Consolas')

		// Fundo do retângulo inferior
		ctx.fillStyle = YELLOW_SECONDARY
		ctx.roundRect(positionX - 200, positionY + 30, 400, 80, [0, 0, 10, 10])
		ctx.fill()

		// Texto "CRASHED"
		updateText('CRASHED', positionX, positionY + 90, WHITE, '60px Consolas')

		ctx.closePath()
	}

	function multiplier(progress) {
		ctx.beginPath()

		// Fundo do retângulo
		ctx.fillStyle = BG_SECONDARY
		ctx.roundRect(positionX - 200, positionY - 110, 400, 150, 10)
		ctx.fill()

		// Valor do crash
		updateText(progress.toFixed(2) + 'X', positionX, positionY, WHITE, '100px Consolas')

		ctx.closePath()
	}

	function updateText(text, x, y, color, font) {
		ctx.beginPath()

		ctx.font = font
		ctx.fillStyle = color
		ctx.textAlign = 'center'
		ctx.fillText(text, x, y)

		ctx.closePath()
	}

	return {
		width,
		height,
		multiplier,
		clear,
		crashMessage,
		drawBezierSplit,
		timer,
	}
}
