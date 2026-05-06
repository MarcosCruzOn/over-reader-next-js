import { Router } from 'express'
import { VolumeController } from '../controllers/volumeController'
import { uploadConfig } from '../config/upload'

export const volumeRoutes = Router()
const volumeController = new VolumeController()

volumeRoutes.post('/', (req, res) => volumeController.create(req, res))
volumeRoutes.get('/manga/:mangaId', (req, res) => volumeController.listByManga(req, res))

// NOVAS ROTAS
volumeRoutes.delete('/:id', (req, res) => volumeController.delete(req, res))
volumeRoutes.patch('/:id/cover', uploadConfig.single('cover'), (req, res) =>
	volumeController.updateCover(req, res)
)
