import { Router } from 'express'
import { ChapterController } from '../controllers/chapterController'
import { uploadConfig } from '../config/upload'

export const chapterRoutes = Router()
const chapterController = new ChapterController()

chapterRoutes.post('/', (req, res) => chapterController.create(req, res))
// Rota limpa e padronizada:
chapterRoutes.get('/volume/:volumeId', (req, res) => chapterController.listByVolume(req, res))
chapterRoutes.patch('/:id/pages', uploadConfig.array('pages', 100), (req, res) =>
	chapterController.uploadPages(req, res)
)
