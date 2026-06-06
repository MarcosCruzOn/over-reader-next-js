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
	'https://seu-projeto-web.vercel.app',
]
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
)
app.use(express.json())

// Injetando todas as rotas na aplicação de uma só vez
app.use(routes)

// Rota de Health Check (Teste para ver se a API está viva)
app.get('/', (req, res) => {
	res.send('API do Over-Reader está online! 🚀')
})

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})
