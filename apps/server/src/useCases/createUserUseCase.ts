import type { UserRepository, CreateUserDTO } from '../repositories/userRepository'

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(data: CreateUserDTO) {
		if (!data.name || !data.email) {
			throw new Error('Nome e email são obrigatórios.')
		}

		const newUser = await this.userRepository.create(data)
		return newUser
	}
}
