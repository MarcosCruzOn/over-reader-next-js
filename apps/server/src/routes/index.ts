import { Router } from 'express'

import { mangaRoutes } from './mangaRoutes'
import { userRoutes } from './userRoutes'
import { reviewRoutes } from './reviewRoutes'
import { favoriteRoutes } from './favoriteRoutes'
import { favoriteChapterRoutes } from './favoriteChapterRoutes'
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
routes.use('/favorite-chapters', favoriteChapterRoutes)
routes.use('/comments', commentRoutes)
routes.use('/volumes', volumeRoutes)
routes.use('/chapters', chapterRoutes)
