import { MangaRepository } from '../repositories/mangaRepository'

export class UpdateMangaCoverUseCase {
	constructor(private mangaRepository: MangaRepository) {}

	async execute(id: number, coverUrl: string) {
		if (!coverUrl) {
			throw new Error('A URL da capa é obrigatória.')
		}

		const manga = await this.mangaRepository.updateCover(id, coverUrl)

		if (!manga) {
			throw new Error('Mangá não encontrado.')
		}

		return manga
	}
}
