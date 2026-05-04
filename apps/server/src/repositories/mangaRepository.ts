import { eq } from 'drizzle-orm'
import { db } from '../db'
import { mangas } from '../entities/mangas'

export type CreateMangaDTO = typeof mangas.$inferInsert

export class MangaRepository {
	async create(data: CreateMangaDTO) {
		const result = await db.insert(mangas).values(data).returning()
		return result[0]
	}

	async findAll() {
		return await db.select().from(mangas)
	}

	async findById(id: number) {
		const result = await db.select().from(mangas).where(eq(mangas.id, id))
		return result[0]
	}

	async update(id: number, data: Partial<CreateMangaDTO>) {
		const result = await db.update(mangas).set(data).where(eq(mangas.id, id)).returning()
		return result[0]
	}

	async delete(id: number) {
		const result = await db.delete(mangas).where(eq(mangas.id, id)).returning()
		return result[0]
	}

	async updateCover(id: number, coverUrl: string) {
		const result = await db
			.update(mangas)
			.set({ coverUrl })
			.where(eq(mangas.id, id))
			.returning()
		return result[0]
	}
}
