import { ChapterRepository } from '../repositories/chapterRepository'

export class UpdateChapterPagesUseCase {
	constructor(private chapterRepository: ChapterRepository) {}

	async execute(id: number, pages: string[]) {
		if (!pages || pages.length === 0) {
			throw new Error('Nenhuma página fornecida para atualização.')
		}
		return await this.chapterRepository.updatePages(id, pages)
	}
}
