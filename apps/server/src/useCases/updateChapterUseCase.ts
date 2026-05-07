import { ChapterRepository, type CreateChapterDTO } from '../repositories/chapterRepository'

export class UpdateChapterUseCase {
	constructor(private chapterRepository: ChapterRepository) {}

	async execute(id: number, data: Partial<CreateChapterDTO>) {
		if (!id) throw new Error('O ID do capítulo é obrigatório para atualização.')
		return await this.chapterRepository.update(id, data)
	}
}
