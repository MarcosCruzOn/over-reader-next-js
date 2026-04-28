import { db } from '../db'
import { reviews } from '../entities/reviews'

export type CreateReviewDTO = typeof reviews.$inferInsert

export class ReviewRepository {
	async create(data: CreateReviewDTO) {
		const result = await db.insert(reviews).values(data).returning()
		return result[0]
	}
}
