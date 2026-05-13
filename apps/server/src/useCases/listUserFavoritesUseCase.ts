import { FavoriteRepository } from '../repositories/favoriteRepository'

export class ListUserFavoritesUseCase {
	constructor(private favoriteRepository: FavoriteRepository) {}

	async execute(userId: string) {
		// Regra de negócio simples: O ID do usuário não pode ser vazio
		if (!userId) {
			throw new Error('O ID do usuário é obrigatório para buscar os favoritos.')
		}

		// Chama o repositório que atualizamos anteriormente
		const favorites = await this.favoriteRepository.findByUser(userId)

		return favorites
	}
}
