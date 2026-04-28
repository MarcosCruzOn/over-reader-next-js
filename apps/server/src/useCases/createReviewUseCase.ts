import type { ReviewRepository, CreateReviewDTO } from '../repositories/reviewRepository'

export class CreateReviewUseCase {
	constructor(private reviewRepository: ReviewRepository) {}

	async execute(data: CreateReviewDTO) {
		// Regra de Negócio 1: Todos os dados precisam estar presentes
		if (!data.userId || !data.mangaId || data.rating === undefined) {
			throw new Error('Usuário, Mangá e Nota (rating) são obrigatórios.')
		}

		// Regra de Negócio 2: A nota DEVE ser de 1 a 5
		if (data.rating < 1 || data.rating > 5) {
			throw new Error('A avaliação deve ser entre 1 e 5 estrelas.')
		}

		const newReview = await this.reviewRepository.create(data)
		return newReview
	}
}
