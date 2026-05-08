import { Router } from 'express'

import { mangaRoutes } from './mangaRoutes'
import { userRoutes } from './userRoutes'
import { reviewRoutes } from './reviewRoutes'
import { favoriteRoutes } from './favoriteRoutes'
import { commentRoutes } from './commentRoutes'
import { volumeRoutes } from './volumeRoutes'
import { chapterRoutes } from './chapterRoutes'
import { authRoutes } from './authRoutes'

export const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/mangas', mangaRoutes)
routes.use('/users', userRoutes)
routes.use('/reviews', reviewRoutes)
routes.use('/favorites', favoriteRoutes)
routes.use('/comments', commentRoutes)
routes.use('/volumes', volumeRoutes)
routes.use('/chapters', chapterRoutes)
