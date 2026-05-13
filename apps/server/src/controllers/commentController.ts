import type { Request, Response } from 'express'
import { CommentRepository } from '../repositories/commentRepository'
import { CreateCommentUseCase } from '../useCases/createCommentUseCase'
import { ListUserCommentsUseCase } from '../useCases/listUserCommentsUseCase' // Vamos criar em breve

export class CommentController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body
			const repository = new CommentRepository()
			const useCase = new CreateCommentUseCase(repository)

			const comment = await useCase.execute(data)
			res.status(201).json(comment)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// 🔥 NOVO: Buscar comentários do usuário
	async listByUser(req: Request, res: Response) {
		try {
			const userId = req.params.userId as string
			const repository = new CommentRepository()
			const useCase = new ListUserCommentsUseCase(repository)

			const comments = await useCase.execute(userId)
			res.json(comments)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
