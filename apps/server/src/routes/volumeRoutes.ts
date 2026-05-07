import { Router } from 'express'
import { VolumeController } from '../controllers/volumeController'
import { uploadConfig } from '../config/upload'

export const volumeRoutes = Router()
const volumeController = new VolumeController()

volumeRoutes.post('/', (req, res) => volumeController.create(req, res))

// 1º As rotas específicas vêm primeiro!
volumeRoutes.get('/manga/:mangaId', (req, res) => volumeController.listByManga(req, res))

// 2º As rotas com parâmetros dinâmicos (:id) vêm depois!
volumeRoutes.get('/:id', (req, res) => volumeController.getById(req, res))
volumeRoutes.put('/:id', (req, res) => volumeController.update(req, res))
volumeRoutes.delete('/:id', (req, res) => volumeController.delete(req, res))
volumeRoutes.patch('/:id/cover', uploadConfig.single('cover'), (req, res) =>
	volumeController.updateCover(req, res)
)
