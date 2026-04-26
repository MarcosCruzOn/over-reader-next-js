import type { MangaRepository, CreateMangaDTO } from '../repositories/mangaRepository'

export class CreateMangaUseCase {
	// O Use Case recebe o repositório no construtor (Inversão de Dependência do SOLID)
	constructor(private mangaRepository: MangaRepository) {}

	async execute(data: CreateMangaDTO) {
		// Regra de negócio simples: verificar se campos essenciais vieram
		if (!data.title || !data.author || !data.status) {
			throw new Error('Título, autor e status são obrigatórios para cadastrar um mangá.')
		}

		// Se estiver tudo certo, manda o repositório salvar
		const newManga = await this.mangaRepository.create(data)
		return newManga
	}
}
