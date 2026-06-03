import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/userRepository'

export class LoginUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(email: string, passwordString: string) {
		if (!email || !passwordString) {
			throw new Error('Email e senha são obrigatórios.')
		}

		// 1. Busca o usuário pelo e-mail
		const user = await this.userRepository.findByEmail(email)

		// 🔥 CORREÇÃO AQUI: Garantindo para o TypeScript que a senha existe
		if (!user || !user.password) {
			throw new Error('Credenciais inválidas.')
		}

		// 2. Compara a senha digitada com a senha criptografada do banco
		const passwordMatch = await bcrypt.compare(passwordString, user.password)
		if (!passwordMatch) {
			throw new Error('Credenciais inválidas.')
		}

		// 3. Verifica se a conta está ativa
		if (user.status !== 'ATIVO') {
			throw new Error('Esta conta está bloqueada ou inativa.')
		}

		// 4. Gera o Token
		const secret = process.env.JWT_SECRET || 'overreader_super_secret_key_2026'

		const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' })

		// 5. Remove a senha antes de devolver pro Frontend
		const { password, ...userWithoutPassword } = user

		return {
			user: userWithoutPassword,
			token,
		}
	}
}
