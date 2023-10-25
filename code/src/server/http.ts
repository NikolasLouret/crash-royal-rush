import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

const app = express()
app.use(express.static(path.join(__dirname, '../../', 'public')))

const server = http.createServer(app)

const io = new Server(server)

const endpoint = new Server(server, {
	path: '/api/',
	cors: {
		origin: true,
		credentials: true,
	},
})

export { server, io, endpoint }
