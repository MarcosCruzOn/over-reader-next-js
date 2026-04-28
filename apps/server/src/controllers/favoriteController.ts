import type { Request, Response } from 'express'
import { FavoriteRepository } from '../repositories/favoriteRepository'
import { AddFavoriteUseCase } from '../useCases/addFavoriteUseCase'

export class FavoriteController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body
			const repository = new FavoriteRepository()
			const useCase = new AddFavoriteUseCase(repository)

			const favorite = await useCase.execute(data)
			res.status(201).json(favorite)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
