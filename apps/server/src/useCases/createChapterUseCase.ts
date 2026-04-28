import type { ChapterRepository, CreateChapterDTO } from '../repositories/chapterRepository'

export class CreateChapterUseCase {
	constructor(private chapterRepository: ChapterRepository) {}
	async execute(data: CreateChapterDTO) {
		if (!data.volumeId || data.chapterNumber === undefined || !data.pages) {
			throw new Error('Volume ID, número do capítulo e páginas são obrigatórios.')
		}
		return await this.chapterRepository.create(data)
	}
}
