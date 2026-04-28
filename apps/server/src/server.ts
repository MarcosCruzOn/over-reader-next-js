import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { mangaRoutes } from './routes/mangaRoutes'
import { userRoutes } from './routes/userRoutes'
import { reviewRoutes } from './routes/reviewRoutes'
import { favoriteRoutes } from './routes/favoriteRoutes'
import { commentRoutes } from './routes/commentRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

// Toda rota que começar com /mangas vai ser direcionada para mangaRoutes
app.use('/mangas', mangaRoutes)
app.use('/users', userRoutes)
app.use('/reviews', reviewRoutes)
app.use('/favorites', favoriteRoutes)
app.use('/comments', commentRoutes)

app.get('/', (req, res) => {
	res.send('API do Over-Reader está online! 🚀')
})

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})
