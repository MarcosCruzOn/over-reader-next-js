import { db } from '../db'
import { and, eq, count, avg } from 'drizzle-orm'
import { reviews } from '../entities/reviews'
import { mangas } from '../entities/mangas'

export type CreateReviewDTO = typeof reviews.$inferInsert

export class ReviewRepository {
	async create(data: CreateReviewDTO) {
		const result = await db.insert(reviews).values(data).returning()
		return result[0]
	}

	// Novo: Busca as avaliações dadas pelo usuário
	async findByUser(userId: string) {
		return await db
			.select({
				id: reviews.id,
				rating: reviews.rating,
				comment: reviews.comment,
				createdAt: reviews.createdAt,
				mangaId: reviews.mangaId,
				manga: {
					id: mangas.id,
					title: mangas.title,
					coverUrl: mangas.coverUrl,
				},
			})
			.from(reviews)
			.innerJoin(mangas, eq(reviews.mangaId, mangas.id))
			.where(eq(reviews.userId, userId))
	}

	// Salva ou atualiza a nota do usuário
	async upsert(data: CreateReviewDTO) {
		const result = await db
			.insert(reviews)
			.values(data)
			.onConflictDoUpdate({
				target: [reviews.userId, reviews.mangaId],
				set: {
					rating: data.rating,
					comment: data.comment,
					updatedAt: new Date(),
				},
			})
			.returning()

		return result[0]
	}

	// Retorna a nota que um usuário específico deu para aquele mangá
	async getUserRating(userId: string, mangaId: number) {
		const result = await db
			.select()
			.from(reviews)
			.where(and(eq(reviews.userId, userId), eq(reviews.mangaId, mangaId)))
			.limit(1)

		return result[0]
	}

	// 🔥 A MAGIA: Calcula a média de estrelas e o total de votos de uma obra
	async getMangaRatingStats(mangaId: number) {
		const stats = await db
			.select({
				averageRating: avg(reviews.rating),
				totalVotes: count(reviews.id),
			})
			.from(reviews)
			.where(eq(reviews.mangaId, mangaId))

		// O avg() do postgres retorna uma string (ex: "4.6666"). Vamos tratar para virar um número bonito como 4.7
		const rawAverage = stats[0]?.averageRating ? parseFloat(stats[0].averageRating) : 0
		const formattedAverage = Math.round(rawAverage * 10) / 10

		return {
			average: formattedAverage,
			total: stats[0]?.totalVotes || 0,
		}
	}
}
