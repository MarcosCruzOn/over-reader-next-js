import { db } from '../db'
import { and, eq } from 'drizzle-orm'
import { favorites } from '../entities/favorites'

export type CreateFavoriteDTO = typeof favorites.$inferInsert

export class FavoriteRepository {
	async create(data: CreateFavoriteDTO) {
		const result = await db.insert(favorites).values(data).returning()
		return result[0]
	}
	// NOVO: Verifica se o usuário já salvou aquele mangá específico
	async checkIfExists(userId: string, mangaId: number) {
		const result = await db
			.select()
			.from(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)))
			.limit(1)

		return result[0] // Retorna o favorito se existir, ou undefined
	}

	// NOVO: Remove o mangá dos favoritos
	async delete(userId: string, mangaId: number) {
		const result = await db
			.delete(favorites)
			.where(and(eq(favorites.userId, userId), eq(favorites.mangaId, mangaId)))
			.returning()

		return result[0]
	}

	// Novo: Busca os mangás salvos pelo usuário
	async findByUser(userId: string) {
		return await db.query.favorites.findMany({
			where: (favorites, { eq }) => eq(favorites.userId, userId),
		})
	}
}
