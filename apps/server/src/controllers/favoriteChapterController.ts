import type { Request, Response } from 'express'
import { FavoriteChapterRepository } from '../repositories/favoriteChapterRepository'
import { AddFavoriteChapterUseCase } from '../useCases/addFavoriteChapterUseCase'
import { RemoveFavoriteChapterUseCase } from '../useCases/removeFavoriteChapterUseCase'
import { CheckFavoriteChapterUseCase } from '../useCases/checkFavoriteChapterUseCase'

export class FavoriteChapterController {
	async create(req: Request, res: Response) {
		try {
			const { userId, chapterId } = req.body
			const repository = new FavoriteChapterRepository()
			const useCase = new AddFavoriteChapterUseCase(repository)

			const favorite = await useCase.execute(userId, Number(chapterId))
			res.status(201).json(favorite)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async remove(req: Request, res: Response) {
		try {
			const { userId, chapterId } = req.params
			const repository = new FavoriteChapterRepository()
			const useCase = new RemoveFavoriteChapterUseCase(repository)

			await useCase.execute(userId, Number(chapterId))
			res.status(204).send()
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async check(req: Request, res: Response) {
		try {
			const { userId, chapterId } = req.params
			const repository = new FavoriteChapterRepository()
			const useCase = new CheckFavoriteChapterUseCase(repository)

			const result = await useCase.execute(userId, Number(chapterId))
			res.json(result)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async listByUser(req: Request, res: Response) {
		try {
			const { userId } = req.params
			const repository = new FavoriteChapterRepository()

			// Chamando o repositório direto aqui para listagem
			const favorites = await repository.findByUser(userId)
			res.json(favorites)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
