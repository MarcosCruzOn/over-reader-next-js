import type { Request, Response } from 'express'
import { ChapterRepository } from '../repositories/chapterRepository'
import { CreateChapterUseCase } from '../useCases/createChapterUseCase'
import { UpdateChapterPagesUseCase } from '../useCases/updateChapterPagesUseCase'

export class ChapterController {
	async create(req: Request, res: Response) {
		try {
			const repository = new ChapterRepository()
			const useCase = new CreateChapterUseCase(repository)
			const chapter = await useCase.execute(req.body)
			res.status(201).json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async listByVolume(req: Request, res: Response) {
		const repository = new ChapterRepository()
		const chapters = await repository.findByVolume(Number(req.params.volumeId))
		res.json(chapters)
	}

	async uploadPages(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)

			// O multer com .array() coloca os arquivos na propriedade req.files (no plural!)
			const files = req.files as any[]

			if (!files || files.length === 0) {
				return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' })
			}

			// Extraímos apenas a propriedade 'location' (a URL do S3) de todos os arquivos
			const pagesUrls = files.map((file) => file.location)

			const repository = new ChapterRepository()
			const useCase = new UpdateChapterPagesUseCase(repository)

			const chapter = await useCase.execute(id, pagesUrls)

			res.json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
