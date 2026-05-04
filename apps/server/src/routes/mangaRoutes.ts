import { Router } from 'express'
import { MangaController } from '../controllers/mangaController'
import { uploadConfig } from '../config/upload' // Importe a configuração no topo

export const mangaRoutes = Router()
const mangaController = new MangaController()

// Quando fizerem um POST em "/", chama a função create do controller
mangaRoutes.post('/', (req, res) => mangaController.create(req, res))
mangaRoutes.get('/', (req, res) => mangaController.list(req, res))
mangaRoutes.put('/:id', (req, res) => mangaController.update(req, res))
mangaRoutes.delete('/:id', (req, res) => mangaController.delete(req, res))

// O "single('cover')" diz que esperamos um campo chamado "cover" no formulário
mangaRoutes.patch('/:id/cover', uploadConfig.single('cover'), (req, res) =>
	mangaController.updateCover(req, res)
)
