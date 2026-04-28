import type { Request, Response } from 'express'
import { ChapterRepository } from '../repositories/chapterRepository'
import { CreateChapterUseCase } from '../useCases/createChapterUseCase'

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
}
