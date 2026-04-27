import type { Request, Response } from 'express'
import { UserRepository } from '../repositories/userRepository'
import { CreateUserUseCase } from '../useCases/createUserUseCase'

export class UserController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body
			const repository = new UserRepository()
			const useCase = new CreateUserUseCase(repository)

			const user = await useCase.execute(data)
			res.status(201).json(user)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
