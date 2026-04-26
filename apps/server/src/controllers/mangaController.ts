import type { Request, Response } from 'express'
import { MangaRepository } from '../repositories/mangaRepository'
import { CreateMangaUseCase } from '../useCases/createMangaUseCase'

export class MangaController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body

			// Montamos o "quebra-cabeça" das classes
			const repository = new MangaRepository()
			const useCase = new CreateMangaUseCase(repository)

			const manga = await useCase.execute(data)

			// Retorna status 201 (Created) e os dados do mangá
			res.status(201).json(manga)
		} catch (error: any) {
			// Se a regra de negócio barrar, devolvemos erro 400 (Bad Request)
			res.status(400).json({ error: error.message })
		}
	}
}
