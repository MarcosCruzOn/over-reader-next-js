import { eq } from 'drizzle-orm'
import { db } from '../db'
import { chapters } from '../entities/chapters'

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
		return await db.delete(chapters).where(eq(chapters.id, id)).returning()
	}
}
