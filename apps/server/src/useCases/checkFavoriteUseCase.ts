import { FavoriteRepository } from '../repositories/favoriteRepository'

export class CheckFavoriteUseCase {
	constructor(private favoriteRepository: FavoriteRepository) {}

	async execute(userId: string, mangaId: number) {
		if (!userId || !mangaId) throw new Error('IDs inválidos.')
		const favorite = await this.favoriteRepository.checkIfExists(userId, mangaId)
		// Retornamos um booleano: true se achou, false se não achou
		return { isFavorited: !!favorite }
	}
}
