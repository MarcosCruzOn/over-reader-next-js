import { Router } from 'express'
import { FavoriteController } from '../controllers/favoriteController'

export const favoriteRoutes = Router()
const favoriteController = new FavoriteController()

favoriteRoutes.post('/', (req, res) => favoriteController.create(req, res))
favoriteRoutes.get('/user/:userId', (req, res) => favoriteController.listByUser(req, res))
favoriteRoutes.get('/check/:userId/:mangaId', (req, res) => favoriteController.check(req, res))
favoriteRoutes.delete('/:userId/:mangaId', (req, res) => favoriteController.remove(req, res))
