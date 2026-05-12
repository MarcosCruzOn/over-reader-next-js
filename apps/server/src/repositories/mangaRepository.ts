import { eq, and, ilike } from 'drizzle-orm'
import { db } from '../db'
import { mangas } from '../entities/mangas'

export type CreateMangaDTO = typeof mangas.$inferInsert

export class MangaRepository {
	async create(data: CreateMangaDTO) {
		const result = await db.insert(mangas).values(data).returning()
		return result[0]
	}

	async findAll(filters?: { search?: string; genre?: string }) {
		// Array para guardar as condições de busca
		const conditions = []

		// Se o usuário digitou algo na busca, procuramos no título
		if (filters?.search) {
			conditions.push(ilike(mangas.title, `%${filters.search}%`))
		}

		// Como você salvou os gêneros como texto (ex: "Ação, Fantasia"),
		// usamos o ilike para ver se a palavra está no meio do texto
		if (filters?.genre) {
			conditions.push(ilike(mangas.genres, `%${filters.genre}%`))
		}

		// Montamos a query base
		let query = db.select().from(mangas)

		// Se tiver alguma condição (search ou genre), aplicamos o WHERE com AND
		if (conditions.length > 0) {
			query = query.where(and(...conditions)) as any
		}

		// Retorna os resultados mais recentes primeiro
		// query = query.orderBy(desc(mangas.createdAt)) // (Opcional: Descomente se tiver a coluna createdAt)

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
