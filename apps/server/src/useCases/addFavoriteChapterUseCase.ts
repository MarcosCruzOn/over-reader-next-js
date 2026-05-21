import { FavoriteChapterRepository } from '../repositories/favoriteChapterRepository'

export class AddFavoriteChapterUseCase {
	constructor(private favoriteChapterRepository: FavoriteChapterRepository) {}

	async execute(userId: string, chapterId: number) {
		if (!userId || !chapterId) throw new Error('IDs inválidos.')

		const exists = await this.favoriteChapterRepository.checkIfExists(userId, chapterId)
		if (exists) throw new Error('Este capítulo já está nos favoritos.')

		return await this.favoriteChapterRepository.create({ userId, chapterId })
	}
}
