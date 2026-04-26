import { Router } from 'express'
import { MangaController } from '../controllers/mangaController'

export const mangaRoutes = Router()
const mangaController = new MangaController()

// Quando fizerem um POST em "/", chama a função create do controller
mangaRoutes.post('/', (req, res) => mangaController.create(req, res))
