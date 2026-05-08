import type { Request, Response } from 'express'
import { UserRepository } from '../repositories/userRepository'
import { LoginUseCase } from '../useCases/loginUseCase'

export class AuthController {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body

			const repository = new UserRepository()
			const useCase = new LoginUseCase(repository)

			const result = await useCase.execute(email, password)

			res.json(result)
		} catch (error: any) {
			// Status 401 = Unauthorized (Não Autorizado)
			res.status(401).json({ error: error.message })
		}
	}
}
