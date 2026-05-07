import { Router } from 'express'

// Importando todas as rotas isoladas
import { mangaRoutes } from './mangaRoutes'
import { userRoutes } from './userRoutes'
import { reviewRoutes } from './reviewRoutes'
import { favoriteRoutes } from './favoriteRoutes'
import { commentRoutes } from './commentRoutes'
import { volumeRoutes } from './volumeRoutes'
import { chapterRoutes } from './chapterRoutes'

// Criando o Roteador Principal
export const routes = Router()

// Registrando os caminhos base para cada arquivo de rotas
routes.use('/mangas', mangaRoutes)
routes.use('/users', userRoutes)
routes.use('/reviews', reviewRoutes)
routes.use('/favorites', favoriteRoutes)
routes.use('/comments', commentRoutes)
routes.use('/volumes', volumeRoutes)
routes.use('/chapters', chapterRoutes)
