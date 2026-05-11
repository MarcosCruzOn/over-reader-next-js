import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { chapters } from '../entities/chapters'
import { volumes } from '../entities/volumes'

export type CreateChapterDTO = typeof chapters.$inferInsert

export class ChapterRepository {
	async create(data: CreateChapterDTO) {
		const result = await db.insert(chapters).values(data).returning()
		return result[0]
	}

	async findByVolume(volumeId: number) {
		return await db.select().from(chapters).where(eq(chapters.volumeId, volumeId))
	}

	async delete(id: number) {
		const result = await db.delete(chapters).where(eq(chapters.id, id)).returning()
		return result[0]
	}

	async update(id: number, data: Partial<CreateChapterDTO>) {
		const result = await db.update(chapters).set(data).where(eq(chapters.id, id)).returning()
		return result[0]
	}

	async updatePages(id: number, pages: string[]) {
		const result = await db
			.update(chapters)
			.set({ pages })
			.where(eq(chapters.id, id))
			.returning()
		return result[0]
	}

	async findById(id: number) {
		const result = await db.select().from(chapters).where(eq(chapters.id, id))
		return result[0]
	}

	async findByMangaAndNumber(mangaId: number, chapterNumber: number) {
		const result = await db
			.select({
				id: chapters.id,
				chapterNumber: chapters.chapterNumber, // Ajuste para o nome exato do seu schema (camelCase)
				title: chapters.title,
				pages: chapters.pages,
			})
			.from(chapters)
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.where(and(eq(volumes.mangaId, mangaId), eq(chapters.chapterNumber, chapterNumber)))
			.limit(1)

		return result[0]
	}

	async findAllByManga(mangaId: number) {
		return await db
			.select({
				id: chapters.id,
				chapterNumber: chapters.chapterNumber,
				title: chapters.title,
				createdAt: chapters.createdAt,
				volumeNumber: volumes.volumeNumber,
			})
			.from(chapters)
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.where(eq(volumes.mangaId, mangaId))
			.orderBy(desc(chapters.chapterNumber)) // Mais recentes primeiro
	}
}
