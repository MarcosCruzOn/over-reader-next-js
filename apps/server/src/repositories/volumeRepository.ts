import { eq } from 'drizzle-orm'
import { db } from '../db'
import { volumes } from '../entities/volumes'

export type CreateVolumeDTO = typeof volumes.$inferInsert

export class VolumeRepository {
	async create(data: CreateVolumeDTO) {
		const result = await db.insert(volumes).values(data).returning()
		return result[0]
	}

	async findByManga(mangaId: number) {
		// 🔥 Sintaxe RQ
		return await db.query.volumes.findMany({
			where: (volumes, { eq }) => eq(volumes.mangaId, mangaId),
			orderBy: (volumes, { asc }) => [asc(volumes.volumeNumber)],
		})
	}

	async findByMangaId(mangaId: number) {
		return await db
			.select()
			.from(volumes)
			.where(eq(volumes.mangaId, mangaId))
			// Ordenamos para o Volume 1 aparecer antes do Volume 2
			.orderBy(volumes.volumeNumber)
	}

	async delete(id: number) {
		return await db.delete(volumes).where(eq(volumes.id, id)).returning()
	}

	async update(id: number, data: Partial<CreateVolumeDTO>) {
		const result = await db.update(volumes).set(data).where(eq(volumes.id, id)).returning()
		return result[0]
	}

	async findById(id: number) {
		const result = await db.select().from(volumes).where(eq(volumes.id, id))
		return result[0]
	}

	async updateCover(id: number, coverUrl: string) {
		const result = await db
			.update(volumes)
			.set({ coverUrl })
			.where(eq(volumes.id, id))
			.returning()
		return result[0]
	}
}
