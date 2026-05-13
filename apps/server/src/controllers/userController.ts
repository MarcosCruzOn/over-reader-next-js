import type { Request, Response } from 'express'
import { UserRepository } from '../repositories/userRepository'
import { CreateUserUseCase } from '../useCases/createUserUseCase'
import { ListUsersUseCase } from '../useCases/listUsersUseCase'
import { ChangeUserStatusUseCase } from '../useCases/changeUserStatusUseCase'
import { UpdateUserAvatarUseCase } from '../useCases/updateUserAvatarUseCase'

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
			// 🔥 CORREÇÃO: ID agora é string pura! Sem Number()
			const id = req.params.id as string
			const { status } = req.body

			const repository = new UserRepository()
			const useCase = new ChangeUserStatusUseCase(repository)

			const user = await useCase.execute(id, status)
			res.json(user)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async updateAvatar(req: Request, res: Response) {
		try {
			// 🔥 CORREÇÃO: ID agora é string pura!
			const id = req.params.id as string
			const file = req.file as any

			if (!file) {
				return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' })
			}

			const avatarUrl = file.location
			const repository = new UserRepository()
			const useCase = new UpdateUserAvatarUseCase(repository)

			const user = await useCase.execute(id, avatarUrl)
			res.json(user)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
