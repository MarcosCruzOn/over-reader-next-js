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
}
