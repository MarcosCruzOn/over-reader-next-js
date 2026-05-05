import { Router } from 'express'
import { VolumeController } from '../controllers/volumeController'

export const volumeRoutes = Router()
const volumeController = new VolumeController()

volumeRoutes.post('/', (req, res) => volumeController.create(req, res))
// Rota limpa e padronizada:
volumeRoutes.get('/manga/:mangaId', (req, res) => volumeController.listByManga(req, res))
