import { UserRepository } from '../repositories/userRepository'

export class UpdateUserAvatarUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: number, avatarUrl: string) {
		if (!avatarUrl) {
			throw new Error('A URL da imagem é obrigatória.')
		}

		const user = await this.userRepository.updateAvatar(id, avatarUrl)

		if (!user) {
			throw new Error('Usuário não encontrado.')
		}

		return user
	}
}
