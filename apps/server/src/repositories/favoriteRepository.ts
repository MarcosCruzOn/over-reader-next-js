import { db } from '../db'
import { favorites } from '../entities/favorites'

export type CreateFavoriteDTO = typeof favorites.$inferInsert

export class FavoriteRepository {
	async create(data: CreateFavoriteDTO) {
		const result = await db.insert(favorites).values(data).returning()
		return result[0]
	}
}
