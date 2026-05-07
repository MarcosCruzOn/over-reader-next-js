import { ChapterRepository } from '../repositories/chapterRepository'

export class DeleteChapterUseCase {
	constructor(private chapterRepository: ChapterRepository) {}

	async execute(id: number) {
		if (!id) {
			throw new Error('O ID do capítulo é obrigatório para exclusão.')
		}

		// O repositório vai deletar do banco. Como usamos "cascade",
		// isso garantirá que o registro do banco suma de forma segura.
		return await this.chapterRepository.delete(id)
	}
}
