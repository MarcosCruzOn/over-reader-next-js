import { eq, and, ilike, desc } from 'drizzle-orm'
import { db } from '../db'
import { mangas } from '../entities/mangas'

export type CreateMangaDTO = typeof mangas.$inferInsert

export class MangaRepository {
	async create(data: CreateMangaDTO) {
		const result = await db.insert(mangas).values(data).returning()
		return result[0]
	}

	// Adicionamos o 'sort' nos filtros
	async findAll(filters?: { search?: string; genre?: string; sort?: string }) {
		const conditions = []

		if (filters?.search) conditions.push(ilike(mangas.title, `%${filters.search}%`))
		if (filters?.genre) conditions.push(ilike(mangas.genres, `%${filters.genre}%`))

		let query = db.select().from(mangas)

		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as any
		}

		// 🔥 LÓGICA DE ORDENAÇÃO:
		if (filters?.sort === 'newest') {
			// Ordena pelos criados mais recentemente
			query = query.orderBy(desc(mangas.createdAt)) as any
		} else if (filters?.sort === 'popular') {
			// Como ainda não temos sistema de visualizações, ordenamos pelo ID (ou rating, se tiver) temporariamente para simular
			query = query.orderBy(desc(mangas.id)) as any
		} else {
			// Padrão: mais recentes primeiro
			query = query.orderBy(desc(mangas.createdAt)) as any
		}

		return await query
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

	async updateBanner(id: number, bannerUrl: string) {
		const result = await db
			.update(mangas)
			.set({ bannerUrl })
			.where(eq(mangas.id, id))
			.returning()
		return result[0]
	}
}
