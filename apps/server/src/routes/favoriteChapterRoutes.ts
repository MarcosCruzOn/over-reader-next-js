import { Router } from 'express'
import { FavoriteChapterController } from '../controllers/favoriteChapterController'

export const favoriteChapterRoutes = Router()
const favoriteChapterController = new FavoriteChapterController()

favoriteChapterRoutes.post('/', (req, res) => favoriteChapterController.create(req, res))
favoriteChapterRoutes.delete('/:userId/:chapterId', (req, res) =>
	favoriteChapterController.remove(req, res)
)
favoriteChapterRoutes.get('/check/:userId/:chapterId', (req, res) =>
	favoriteChapterController.check(req, res)
)
favoriteChapterRoutes.get('/user/:userId', (req, res) =>
	favoriteChapterController.listByUser(req, res)
)
