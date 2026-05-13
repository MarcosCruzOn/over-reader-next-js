import { db } from '../db'
import { reviews } from '../entities/reviews'

export type CreateReviewDTO = typeof reviews.$inferInsert

export class ReviewRepository {
	async create(data: CreateReviewDTO) {
		const result = await db.insert(reviews).values(data).returning()
		return result[0]
	}

	// Novo: Busca as avaliações dadas pelo usuário
	async findByUser(userId: string) {
		return await db.query.reviews.findMany({
			where: (reviews, { eq }) => eq(reviews.userId, userId),
		})
	}
}
