import { Router } from 'express'
import { ChapterController } from '../controllers/chapterController'
import { uploadConfig } from '../config/upload'

export const chapterRoutes = Router()
const chapterController = new ChapterController()

// Criar capítulo
chapterRoutes.post('/', (req, res) => chapterController.create(req, res))

// Listar capítulos de um volume
chapterRoutes.get('/volume/:volumeId', (req, res) => chapterController.listByVolume(req, res))

// Upload das imagens do capítulo
chapterRoutes.patch('/:id/pages', uploadConfig.array('pages', 100), (req, res) =>
	chapterController.uploadPages(req, res)
)

chapterRoutes.get('/manga/:mangaId/number/:chapterNumber', (req, res) =>
	chapterController.getByMangaAndNumber(req, res)
)
chapterRoutes.get('/:id', (req, res) => chapterController.getById(req, res))
chapterRoutes.put('/:id', (req, res) => chapterController.update(req, res))

chapterRoutes.get('/manga/:mangaId', (req, res) => chapterController.listByManga(req, res))

// 🔥 Nossa rota de exclusão LIMPA!
chapterRoutes.delete('/:id', (req, res) => chapterController.delete(req, res))
