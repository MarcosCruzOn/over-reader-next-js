import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Importando todas as rotas
import { mangaRoutes } from './routes/mangaRoutes'
import { userRoutes } from './routes/userRoutes'
import { reviewRoutes } from './routes/reviewRoutes'
import { favoriteRoutes } from './routes/favoriteRoutes'
import { commentRoutes } from './routes/commentRoutes'
import { volumeRoutes } from './routes/volumeRoutes'
import { chapterRoutes } from './routes/chapterRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

// Registrando as rotas no Express
app.use('/mangas', mangaRoutes)
app.use('/users', userRoutes)
app.use('/reviews', reviewRoutes)
app.use('/favorites', favoriteRoutes)
app.use('/comments', commentRoutes)
app.use('/volumes', volumeRoutes) // Registramos os Volumes aqui!
app.use('/chapters', chapterRoutes) // Registramos os Capítulos aqui!

app.get('/', (req, res) => {
	res.send('API do Over-Reader está online! 🚀')
})

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`)
})
