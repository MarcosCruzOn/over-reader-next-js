import { MangaRepository } from '../repositories/mangaRepository'

export class DeleteMangaUseCase {
	constructor(private mangaRepository: MangaRepository) {}
	async execute(id: number) {
		const mangaExists = await this.mangaRepository.findById(id)
		if (!mangaExists) throw new Error('Mangá não encontrado.')
		return await this.mangaRepository.delete(id)
	}
}
