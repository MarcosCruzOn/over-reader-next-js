import type { Request, Response } from 'express'
import { UserRepository } from '../repositories/userRepository'
import { CreateUserUseCase } from '../useCases/createUserUseCase'
import { ListUsersUseCase } from '../useCases/listUsersUseCase'
import { ChangeUserStatusUseCase } from '../useCases/changeUserStatusUseCase'

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

	async list(req: Request, res: Response) {
		const repository = new UserRepository()
		const useCase = new ListUsersUseCase(repository)
		const users = await useCase.execute()
		res.json(users)
	}

	async changeStatus(req: Request, res: Response) {
		try {
			// Pega o ID que vem na URL (ex: /users/1/status)
			const id = Number(req.params.id)
			// Pega o novo status que vem no corpo (JSON)
			const { status } = req.body

			const repository = new UserRepository()
			const useCase = new ChangeUserStatusUseCase(repository)

			const user = await useCase.execute(id, status)
			res.json(user)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
