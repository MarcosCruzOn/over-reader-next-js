import type { Request, Response } from 'express'
import { FavoriteRepository } from '../repositories/favoriteRepository'
import { AddFavoriteUseCase } from '../useCases/addFavoriteUseCase'
import { CheckFavoriteUseCase } from '../useCases/checkFavoriteUseCase'
import { RemoveFavoriteUseCase } from '../useCases/removeFavoriteUseCase'
import { ListUserFavoritesUseCase } from '../useCases/listUserFavoritesUseCase'

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

	// 🔥 NOVO: Buscar favoritos do usuário
	async listByUser(req: Request, res: Response) {
		try {
			const userId = req.params.userId as string // Lembre-se, é string!
			const repository = new FavoriteRepository()
			const useCase = new ListUserFavoritesUseCase(repository)

			const favorites = await useCase.execute(userId)
			res.json(favorites)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// 🔥 NOVO: Checar
	async check(req: Request, res: Response) {
		try {
			const { userId, mangaId } = req.params
			const repository = new FavoriteRepository()
			const useCase = new CheckFavoriteUseCase(repository)

			const result = await useCase.execute(userId as string, Number(mangaId))
			res.json(result)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// 🔥 NOVO: Remover
	async remove(req: Request, res: Response) {
		try {
			const { userId, mangaId } = req.params
			const repository = new FavoriteRepository()
			const useCase = new RemoveFavoriteUseCase(repository)

			await useCase.execute(userId as string, Number(mangaId))
			res.status(204).send()
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
