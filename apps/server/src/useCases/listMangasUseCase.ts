import { MangaRepository } from '../repositories/mangaRepository'

export class ListMangasUseCase {
	constructor(private mangaRepository: MangaRepository) {}

	// Agora o execute recebe os filtros opcionais
	async execute(filters?: { search?: string; genre?: string; sort?: string }) {
		return await this.mangaRepository.findAll(filters)
	}
}
