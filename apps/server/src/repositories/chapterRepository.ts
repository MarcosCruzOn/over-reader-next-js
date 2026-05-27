import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { chapters } from '../entities/chapters'
import { volumes } from '../entities/volumes'
import { mangas } from '../entities/mangas'

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
				volumeCover: volumes.coverUrl,
			})
			.from(chapters)
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.where(eq(volumes.mangaId, mangaId))
			.orderBy(desc(chapters.chapterNumber)) // Mais recentes primeiro
	}

	// 🔥 NOVA FUNÇÃO: Busca os lançamentos mais recentes (Sem mangás repetidos!)
	async getLatestFeed(limitCount: number = 20) {
		// 1. Buscamos um lote maior do banco (ex: limitCount * 5) para garantir que,
		// após remover os capítulos repetidos do mesmo mangá, ainda teremos a quantidade desejada.
		const rawFeed = await db
			.select({
				chapterId: chapters.id,
				chapterNumber: chapters.chapterNumber,
				createdAt: chapters.createdAt,
				volumeId: volumes.id,
				volumeCover: volumes.coverUrl, // Traz a CAPA DO VOLUME
				mangaId: mangas.id,
				mangaTitle: mangas.title,
			})
			.from(chapters)
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.innerJoin(mangas, eq(volumes.mangaId, mangas.id))
			.orderBy(desc(chapters.createdAt))
			.limit(limitCount * 5) // Margem de segurança para o filtro funcionar bem

		// 2. Filtramos no JavaScript para manter apenas o capítulo MAIS RECENTE de cada Mangá
		const uniqueFeed = []
		const seenMangaIds = new Set() // O "Set" é perfeito porque procura IDs instantaneamente

		for (const item of rawFeed) {
			// Se o ID deste mangá ainda não foi visto no nosso laço de repetição...
			if (!seenMangaIds.has(item.mangaId)) {
				uniqueFeed.push(item) // Adicionamos à lista final
				seenMangaIds.add(item.mangaId) // Marcamos este mangá como "já processado"
			}

			// Se já atingimos a quantidade que o Frontend pediu (ex: 20), paramos de processar!
			if (uniqueFeed.length === limitCount) break
		}

		return uniqueFeed
	}
}
