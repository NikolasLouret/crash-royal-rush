const { server } = require('./http')
require('./socket-io')

const port = process.env.PORT || 5500

server.listen(port, () => {
	console.log(`Servidor Socket.io está ouvindo na porta ${port}`)
})
