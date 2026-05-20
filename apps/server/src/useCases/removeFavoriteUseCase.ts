import { FavoriteRepository } from '../repositories/favoriteRepository'

export class RemoveFavoriteUseCase {
	constructor(private favoriteRepository: FavoriteRepository) {}

	async execute(userId: string, mangaId: number) {
		if (!userId || !mangaId) throw new Error('IDs inválidos.')
		return await this.favoriteRepository.delete(userId, mangaId)
	}
}
