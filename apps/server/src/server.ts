import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { initSocket } from './utils/socket'

import { routes } from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

const server = createServer(app) // Envolve o Express no servidor HTTP
initSocket(server)

// Middlewares globais
const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:3001',
	'https://over-reader-next-js-admin.vercel.app',

	'https://over-reader-web.vercel.app',
]

app.use(
	cors({
		origin: function (origin, callback) {
			// Permite requisições sem origin (como ferramentas locais tipo Postman)
			if (!origin) return callback(null, true)

			// 🔥 A MÁGICA: Permite se estiver na lista exata OU se for uma URL de Preview da Vercel
			if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
				return callback(null, true)
			}

			// Se não for nenhum dos dois, bloqueia!
			return callback(new Error('Bloqueado pelo CORS do Over-Reader'), false)
		},
		credentials: true,
	})
)

app.use(express.json())

// Injetando todas as rotas na aplicação de uma só vez
app.use(routes)

// Rota de Health Check (Teste para ver se a API está viva)
app.get('/', (req, res) => {
	res.send('API do Over-Reader está online e aceitando a Vercel! 🚀')
})

// Aqui nós usamos o server.listen em vez de app.listen por causa do Socket.io
server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})
