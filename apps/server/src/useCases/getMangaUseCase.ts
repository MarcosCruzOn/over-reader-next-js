import { MangaRepository } from '../repositories/mangaRepository'

export class GetMangaUseCase {
	constructor(private mangaRepository: MangaRepository) {}

	async execute(id: number) {
		const manga = await this.mangaRepository.findById(id)
		if (!manga) throw new Error('Mangá não encontrado.')
		return manga
	}
}
