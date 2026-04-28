import { MangaRepository } from '../repositories/mangaRepository'

export class ListMangasUseCase {
	constructor(private mangaRepository: MangaRepository) {}
	async execute() {
		return await this.mangaRepository.findAll()
	}
}
