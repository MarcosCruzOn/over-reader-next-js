import type { Request, Response } from 'express'
import { ReviewRepository } from '../repositories/reviewRepository'
import { CreateReviewUseCase } from '../useCases/createReviewUseCase'

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
}
