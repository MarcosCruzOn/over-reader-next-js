import type { UserRepository, CreateUserDTO } from '../repositories/userRepository'

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(data: CreateUserDTO) {
		if (!data.name || !data.email) {
			throw new Error('Nome e email são obrigatórios.')
		}

		// Como o email é unique no banco, o próprio banco geraria um erro se fosse duplicado,
		// mas em um cenário real mais avançado, poderíamos fazer uma busca aqui antes para
		// retornar uma mensagem de erro mais amigável ao frontend.

		const newUser = await this.userRepository.create(data)
		return newUser
	}
}
