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

	// Função para receber o upload e salvar no banco
	async updateAvatar(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)

			// O multer-s3 anexa o arquivo processado dentro de req.file
			// A propriedade "location" é a URL pública gerada pela AWS S3
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
