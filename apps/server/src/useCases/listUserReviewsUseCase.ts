import { ReviewRepository } from '../repositories/reviewRepository'

export class ListUserReviewsUseCase {
	constructor(private reviewRepository: ReviewRepository) {}

	async execute(userId: string) {
		if (!userId) {
			throw new Error('O ID do usuário é obrigatório para buscar as avaliações.')
		}

		const reviews = await this.reviewRepository.findByUser(userId)

		return reviews
	}
}
