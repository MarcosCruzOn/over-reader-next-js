import { Router } from 'express'
import { FavoriteController } from '../controllers/favoriteController'

export const favoriteRoutes = Router()
const favoriteController = new FavoriteController()

favoriteRoutes.post('/', (req, res) => favoriteController.create(req, res))
