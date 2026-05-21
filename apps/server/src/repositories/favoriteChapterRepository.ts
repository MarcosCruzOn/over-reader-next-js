import { and, eq, desc } from 'drizzle-orm'
import { db } from '../db'
import { favoriteChapters } from '../entities/favorite_chapters'
import { chapters } from '../entities/chapters'
import { volumes } from '../entities/volumes'
import { mangas } from '../entities/mangas'

export type CreateFavoriteChapterDTO = typeof favoriteChapters.$inferInsert

export class FavoriteChapterRepository {
	async create(data: CreateFavoriteChapterDTO) {
		const result = await db.insert(favoriteChapters).values(data).returning()
		return result[0]
	}

	async checkIfExists(userId: string, chapterId: number) {
		const result = await db
			.select()
			.from(favoriteChapters)
			.where(
				and(eq(favoriteChapters.userId, userId), eq(favoriteChapters.chapterId, chapterId))
			)
			.limit(1)
		return result[0]
	}

	async delete(userId: string, chapterId: number) {
		const result = await db
			.delete(favoriteChapters)
			.where(
				and(eq(favoriteChapters.userId, userId), eq(favoriteChapters.chapterId, chapterId))
			)
			.returning()
		return result[0]
	}

	// 🔥 A MEGA QUERY: Traz tudo o que o Frontend precisa para desenhar a tela e agrupar
	async findByUser(userId: string) {
		const results = await db
			.select({
				favoriteId: favoriteChapters.id,
				chapterId: chapters.id,
				chapterNumber: chapters.chapterNumber, // Ajuste para o nome da sua coluna de número do cap
				chapterTitle: chapters.title,
				volumeId: volumes.id,
				volumeCover: volumes.coverUrl, // Puxa a capa do VOLUME
				mangaId: mangas.id,
				mangaTitle: mangas.title, // Para sabermos de qual mangá é
				savedAt: favoriteChapters.createdAt,
			})
			.from(favoriteChapters)
			.innerJoin(chapters, eq(favoriteChapters.chapterId, chapters.id))
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.innerJoin(mangas, eq(volumes.mangaId, mangas.id))
			.where(eq(favoriteChapters.userId, userId))
			.orderBy(desc(favoriteChapters.createdAt))

		return results
	}
}
