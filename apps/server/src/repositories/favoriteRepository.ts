import { and, eq, desc } from 'drizzle-orm'
import { db } from '../db'
import { favorites } from '../entities/favorites'
import { mangas } from '../entities/mangas'

export type CreateFavoriteDTO = typeof favorites.$inferInsert

export class FavoriteRepository {
	async create(data: CreateFavoriteDTO) {
		const result = await db.insert(favorites).values(data).returning()
		return result[0]
	}

	async checkIfExists(userId: string, mangaId: number) {
		const result = await db
			.select()
			.from(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)))
			.limit(1)
		return result[0]
	}

	async delete(userId: string, mangaId: number) {
		const result = await db
			.delete(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)))
			.returning()
		return result[0]
	}

	// 🔥 ATUALIZADO: Agora faz um INNER JOIN com a tabela de mangás
	async findByUser(userId: string) {
		return await db
			.select({
				favoriteId: favorites.id,
				mangaId: mangas.id,
				title: mangas.title,
				coverUrl: mangas.coverUrl,
				savedAt: favorites.createdAt,
			})
			.from(favorites)
			.innerJoin(mangas, eq(favorites.mangaId, mangas.id))
			.where(eq(favorites.userId, userId))
			.orderBy(desc(favorites.createdAt)) // Os mais recentemente salvos aparecem primeiro!
	}
}
