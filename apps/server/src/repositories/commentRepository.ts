import { db } from '../db'
import { comments } from '../entities/comments'

export type CreateCommentDTO = typeof comments.$inferInsert

export class CommentRepository {
	async create(data: CreateCommentDTO) {
		const result = await db.insert(comments).values(data).returning()
		return result[0]
	}

	// Novo: Busca os comentários feitos pelo usuário
	async findByUser(userId: string) {
		return await db.query.comments.findMany({
			where: (comments, { eq }) => eq(comments.userId, userId),
		})
	}
}
