document.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('canvas')
	const ctx = canvas.getContext('2d')
	const width = canvas.width
	const height = canvas.height
	const position = 20
	const crash = 15.5 //Math.random() * (5.8 - 2.0) + 2.0

	let i = 0

	function init() {
		animatePathDrawing(ctx, position, height - position, width - position, position, crash - 1)
	}

	function animatePathDrawing(ctx, startX, startY, endX, endY, crashNum) {
		timeInterval = null
		var start = null
		let controllXVariance = width / 2,
			controllYVariance = height / 2,
			acelerator = 0

		const TextX = width / 2,
			TextY = height / 2

		var step = function animatePathDrawingStep(timestamp) {
			if (start === null) start = timestamp
			var delta = timestamp - start + acelerator,
				progress = delta / 10_000
			acelerator += progress * 5

			if (progress < crashNum) {
				// Clear canvas
				clear()

				// Controll variance
				if (progress > 1.0) {
					controllXVariance += acelerator / (progress * 100_000)
					controllYVariance += acelerator / (progress * 100_000)
				}

				// Draw curve
				drawBezierSplit(
					ctx,
					startX,
					startY,
					controllXVariance,
					controllYVariance,
					endX,
					endY,
					0,
					Math.min(progress, 1.0),
				)

				multiplier(TextX, TextY, progress)
				window.requestAnimationFrame(step)
			} else {
				acelerator = 0

				clear()

				drawBezierSplit(
					ctx,
					startX,
					startY,
					controllXVariance,
					controllYVariance,
					endX,
					endY,
					0,
					Math.min(progress, 1.0),
				)

				crashMessage(TextX, TextY)

				setTimeout(() => {
					clear()

					drawBezierSplit(
						ctx,
						startX,
						startY,
						controllXVariance,
						controllYVariance,
						endX,
						endY,
						0,
						Math.min(progress, 1.0),
					)

					timer()
				}, 3_000)

				setTimeout(
					() => animatePathDrawing(ctx, position, height - position, width - position, position, crash - 1),
					8_500,
				)
			}
		}

		window.requestAnimationFrame(step)
	}

	function drawBezierSplit(ctx, startX, startY, controllX, controllY, endX, endY, t0, t1) {
		ctx.beginPath()

		var t00 = t0 * t0,
			t01 = 1.0 - t0,
			t02 = t01 * t01,
			t03 = 2.0 * t0 * t01

		var nstartX = t02 * startX + t03 * controllX + t00 * endX,
			nstartY = t02 * startY + t03 * controllY + t00 * endY

		t00 = t1 * t1
		t01 = 1.0 - t1
		t02 = t01 * t01
		t03 = 2.0 * t1 * t01

		var nendX = t02 * startX + t03 * controllX + t00 * endX,
			nendY = t02 * startY + t03 * controllY + t00 * endY

		var ncontrollX = lerp(lerp(startX, controllX, t0), lerp(controllX, endX, t0), t1),
			ncontrollY = lerp(lerp(startY, controllY, t0), lerp(controllY, endY, t0), t1)

		ctx.moveTo(nstartX, nstartY)
		ctx.quadraticCurveTo(ncontrollX, ncontrollY, nendX, nendY)

		ctx.stroke()
		ctx.closePath()

		ctx.beginPath()
		ctx.arc(nendX, nendY, 5, 0, 365)
		ctx.fill()
	}

	/**
	 * Linearly interpolates between two numbers
	 */
	function lerp(v0, v1, t) {
		return (1.0 - t) * v0 + t * v1
	}

	function timer() {
		if (i == 0) {
			i = 1
			let timerWidth = 1,
				id = setInterval(frame, 10),
				x = width / 2,
				y = height / 2

			function frame() {
				if (timerWidth >= 500) {
					clearInterval(id)
					i = 0
				} else {
					timerWidth++
					ctx.clearRect(x - 125, y - 15, 250, 30)

					ctx.beginPath()

					ctx.fillStyle = '#c3c3c3'
					ctx.roundRect(x - 125, y - 15, 250, 30, 5)
					ctx.fill()

					ctx.closePath()
					ctx.beginPath()

					ctx.fillStyle = '#d3d3d3'
					ctx.roundRect(x - 125, y - 15, timerWidth / 2, 30, 5)
					ctx.fill()

					updataText((timerWidth / 100).toFixed(1) + 's', x, y + 5, '15px Consolas')

					ctx.closePath()
				}
			}
		}
	}

	function clear() {
		ctx.clearRect(0, 0, width, height)
	}

	function crashMessage(x, y) {
		ctx.beginPath()

		ctx.fillStyle = '#d3d3d3'
		ctx.roundRect(x - 75, y - 40, 150, 60, [10, 10, 0, 0])
		ctx.fill()

		updataText(crash.toFixed(2) + 'X', x, y, '30px Consolas')

		ctx.fillStyle = 'gray'
		ctx.roundRect(x - 75, y + 20, 150, 30, [0, 0, 10, 10])
		ctx.fill()

		updataText('CRASHED', x, y + 40, '15px Consolas')

		ctx.closePath()
	}

	function multiplier(x, y, progress) {
		ctx.beginPath()

		ctx.fillStyle = '#d3d3d3'
		ctx.roundRect(x - 75, y - 40, 150, 60, 10)
		ctx.fill()

		updataText((progress + 1).toFixed(2) + 'X', x, y, '30px Consolas')

		ctx.closePath()
	}

	function updataText(text, x, y, font) {
		ctx.beginPath()

		ctx.font = font
		ctx.fillStyle = 'black'
		ctx.textAlign = 'center'
		ctx.fillText(text, x, y)

		ctx.closePath()
	}

	init()
})
