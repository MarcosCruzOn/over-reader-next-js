import { FavoriteChapterRepository } from '../repositories/favoriteChapterRepository'

export class RemoveFavoriteChapterUseCase {
	constructor(private favoriteChapterRepository: FavoriteChapterRepository) {}

	async execute(userId: string, chapterId: number) {
		if (!userId || !chapterId) throw new Error('IDs inválidos.')
		return await this.favoriteChapterRepository.delete(userId, chapterId)
	}
}
