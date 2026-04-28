import type { CommentRepository, CreateCommentDTO } from '../repositories/commentRepository'

export class CreateCommentUseCase {
	constructor(private commentRepository: CommentRepository) {}

	async execute(data: CreateCommentDTO) {
		if (!data.userId || !data.mangaId || !data.content) {
			throw new Error('Usuário, Mangá e o conteúdo do comentário são obrigatórios.')
		}

		// Regra de Negócio: Evitar comentários vazios ou só com espaços
		if (data.content.trim().length === 0) {
			throw new Error('O comentário não pode estar vazio.')
		}

		return await this.commentRepository.create(data)
	}
}
