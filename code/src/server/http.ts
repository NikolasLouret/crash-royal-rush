import http from 'http'
import express from 'express'
import path from 'path'
import { Server } from 'socket.io'
import { router } from './routes/router'
import cors from 'cors'

const app = express()
app.use(express.static(path.join(__dirname, '../../', 'public')))
app.use(cors())

app.use('/api/game', router)

const server = http.createServer(app)

const io = new Server(server, {
	path: '/game',
})

const endpoint = new Server(server, {
	cors: {
		origin: true,
		credentials: true,
	},
})

export { server, io, endpoint }
