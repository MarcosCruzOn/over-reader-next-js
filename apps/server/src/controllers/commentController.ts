import type { Request, Response } from 'express'
import { CommentRepository } from '../repositories/commentRepository'

export class CommentController {
	// Envia um comentário ou resposta
	async createComment(req: Request, res: Response) {
		try {
			const { userId, chapterId, text, parentId } = req.body
			const repository = new CommentRepository()

			if (!text || text.trim() === '') {
				return res
					.status(400)
					.json({ error: 'O texto do comentário não pode estar vazio.' })
			}

			const comment = await repository.create({
				userId: userId as string,
				chapterId: Number(chapterId),
				text: text as string,
				parentId: parentId ? Number(parentId) : null,
			})

			res.status(201).json(comment)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Lista todos os comentários do capítulo
	async getChapterComments(req: Request, res: Response) {
		try {
			const { chapterId } = req.params
			const { userId } = req.query // Passado de forma opcional para sabermos se o usuário logado curtiu os comentários

			const repository = new CommentRepository()
			const commentsList = await repository.getCommentsByChapter(
				Number(chapterId),
				userId ? (userId as string) : undefined
			)

			res.json(commentsList)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Curte ou descurte um comentário
	async toggleCommentLike(req: Request, res: Response) {
		try {
			const { userId, commentId } = req.body
			const repository = new CommentRepository()

			const result = await repository.toggleLike(userId as string, Number(commentId))
			res.json(result)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Denuncia um comentário ofensivo
	async reportComment(req: Request, res: Response) {
		try {
			const { userId, commentId, reason } = req.body
			const repository = new CommentRepository()

			if (!reason) {
				return res.status(400).json({ error: 'O motivo da denúncia é obrigatório.' })
			}

			const report = await repository.createReport({
				userId: userId as string,
				commentId: Number(commentId),
				reason: reason as string,
			})

			res.status(201).json({
				message: 'Comentário denunciado com sucesso. A moderação irá analisar.',
				report,
			})
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// Traz o histórico de comentários de um usuário
	async getUserComments(req: Request, res: Response) {
		try {
			const { userId } = req.params
			const repository = new CommentRepository()

			const commentsList = await repository.getCommentsByUser(userId as string)
			res.json(commentsList)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
