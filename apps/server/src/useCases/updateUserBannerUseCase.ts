import { UserRepository } from '../repositories/userRepository'

export class UpdateUserBannerUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: string, bannerUrl: string) {
		if (!id) throw new Error('ID do usuário é obrigatório.')
		if (!bannerUrl) throw new Error('A URL do banner é obrigatória.')

		return await this.userRepository.updateBanner(id, bannerUrl)
	}
}
