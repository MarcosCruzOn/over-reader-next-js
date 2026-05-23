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
			const userId = req.params.userId as string
			const repository = new ReviewRepository()
			const useCase = new ListUserReviewsUseCase(repository)

			const reviews = await useCase.execute(userId)
			res.json(reviews)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async upsertReview(req: Request, res: Response) {
		try {
			const { userId, mangaId, rating, comment } = req.body

			const repository = new ReviewRepository()
			const useCase = new CreateReviewUseCase(repository)

			const review = await useCase.execute({
				userId: userId as string,
				mangaId: Number(mangaId),
				rating: Number(rating),
				comment: comment as string | null,
			})

			res.status(200).json(review)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Resgata a nota específica que o usuário logado deu para a obra
	async getUserRating(req: Request, res: Response) {
		try {
			const { userId, mangaId } = req.params
			const repository = new ReviewRepository()

			const rating = await repository.getUserRating(userId as string, Number(mangaId))
			res.json(rating || { rating: 0, comment: '' })
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Traz a média de estrelas calculada e a quantidade total de votos
	async getMangaStats(req: Request, res: Response) {
		try {
			const { mangaId } = req.params
			const repository = new ReviewRepository()

			const stats = await repository.getMangaRatingStats(Number(mangaId))
			res.json(stats)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
