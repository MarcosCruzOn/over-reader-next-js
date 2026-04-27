import { UserRepository } from '../repositories/userRepository'

export class ChangeUserStatusUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: number, status: string) {
		// Regra de negócio: garantir que não enviem status malucos como "abacaxi"
		const validStatuses = ['ATIVO', 'BANIDO', 'SUSPENSO']
		if (!validStatuses.includes(status)) {
			throw new Error("Status inválido. Use 'ATIVO', 'BANIDO' ou 'SUSPENSO'.")
		}

		const user = await this.userRepository.updateStatus(id, status)

		if (!user) {
			throw new Error('Usuário não encontrado.')
		}

		return user
	}
}
