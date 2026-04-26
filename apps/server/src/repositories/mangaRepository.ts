import { db } from '../db'
import { mangas } from '../entities/mangas'

// Tipagem automática do Drizzle baseada na nossa tabela
export type CreateMangaDTO = typeof mangas.$inferInsert

export class MangaRepository {
	async create(data: CreateMangaDTO) {
		// Insere os dados no banco e retorna o mangá criado
		const result = await db.insert(mangas).values(data).returning()
		return result[0]
	}
}
