//const router = require('express').Router()

import { Router } from 'express'
import { gameInstance as game } from '../game-instance'

const router = Router()
router.route('/stop').get((req, res) => {
	res.json({ currentCrash: game.getCurrentCrash() })
})

export { router }
