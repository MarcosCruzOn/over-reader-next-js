import { FavoriteChapterRepository } from '../repositories/favoriteChapterRepository'

export class CheckFavoriteChapterUseCase {
	constructor(private favoriteChapterRepository: FavoriteChapterRepository) {}

	async execute(userId: string, chapterId: number) {
		if (!userId || !chapterId) throw new Error('IDs inválidos.')
		const favorite = await this.favoriteChapterRepository.checkIfExists(userId, chapterId)
		return { isFavorited: !!favorite }
	}
}
