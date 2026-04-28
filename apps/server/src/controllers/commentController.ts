import type { Request, Response } from 'express'
import { CommentRepository } from '../repositories/commentRepository'
import { CreateCommentUseCase } from '../useCases/createCommentUseCase'

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
}
