import { server } from './http'
import './socket-io'

const port = process.env.PORT || 5500

server.listen(port, () => {
	console.log(`Servidor Socket.io disponivel em 'http://localhost:${port}'`)
})
