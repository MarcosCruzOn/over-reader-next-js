import type { UserRepository, CreateUserDTO } from '../repositories/userRepository'
import bcrypt from 'bcryptjs' // Importamos a biblioteca

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(data: CreateUserDTO) {
		// Agora a senha também é obrigatória
		if (!data.name || !data.email || !data.password) {
			throw new Error('Nome, email e senha são obrigatórios.')
		}

		// Verifica se o e-mail já existe para não dar erro feio no banco
		const userExists = await this.userRepository.findByEmail(data.email)
		if (userExists) {
			throw new Error('Este e-mail já está em uso.')
		}

		// 🔥 CRIPTOGRAFA A SENHA:
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(data.password, salt)

		// Substitui a senha limpa pela senha embaralhada antes de salvar
		const userData = {
			...data,
			password: hashedPassword,
		}

		const newUser = await this.userRepository.create(userData)

		// 🔥 O GUARDA-COSTAS: Garante ao TypeScript que o newUser existe!
		if (!newUser) {
			throw new Error('Falha catastrófica: O usuário não foi retornado pelo banco.')
		}

		// Agora o TypeScript sabe que o newUser é 100% real e para de gritar
		const { password, ...userWithoutPassword } = newUser
		return userWithoutPassword
	}
}
