import type { Request, Response } from 'express'
import { ReviewRepository } from '../repositories/reviewRepository'
import { CreateReviewUseCase } from '../useCases/createReviewUseCase'
import { ListUserReviewsUseCase } from '../useCases/listUserReviewsUseCase' // Vamos criar em breve

export class ReviewController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body
			const repository = new ReviewRepository()
			const useCase = new CreateReviewUseCase(repository)

			const review = await useCase.execute(data)
			res.status(201).json(review)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// 🔥 NOVO: Buscar avaliações do usuário
	async listByUser(req: Request, res: Response) {
		try {
			const userId = req.params.userId
			const repository = new ReviewRepository()
			const useCase = new ListUserReviewsUseCase(repository)

			const reviews = await useCase.execute(userId)
			res.json(reviews)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
