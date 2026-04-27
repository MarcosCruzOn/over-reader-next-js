import { UserRepository } from '../repositories/userRepository'

export class ListUsersUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute() {
		return await this.userRepository.findAll()
	}
}
