import type { MangaRepository, CreateMangaDTO } from '../repositories/mangaRepository'

export class UpdateMangaUseCase {
	constructor(private mangaRepository: MangaRepository) {}
	async execute(id: number, data: Partial<CreateMangaDTO>) {
		const mangaExists = await this.mangaRepository.findById(id)
		if (!mangaExists) throw new Error('Mangá não encontrado.')
		return await this.mangaRepository.update(id, data)
	}
}
