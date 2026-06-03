import { CommentRepository } from '../repositories/commentRepository'

export class ListUserCommentsUseCase {
	constructor(private commentRepository: CommentRepository) {}

	async execute(userId: string) {
		if (!userId) {
			throw new Error('O ID do usuário é obrigatório para buscar os comentários.')
		}

		const comments = await this.commentRepository.getCommentsByUser(userId)

		return comments
	}
}
