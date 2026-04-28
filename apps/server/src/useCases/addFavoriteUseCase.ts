import type { FavoriteRepository, CreateFavoriteDTO } from '../repositories/favoriteRepository'

export class AddFavoriteUseCase {
	constructor(private favoriteRepository: FavoriteRepository) {}

	async execute(data: CreateFavoriteDTO) {
		if (!data.userId || !data.mangaId) {
			throw new Error('Usuário e Mangá são obrigatórios para favoritar.')
		}
		return await this.favoriteRepository.create(data)
	}
}
