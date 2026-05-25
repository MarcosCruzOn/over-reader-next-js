import { Router } from 'express'
import { CommentController } from '../controllers/commentController'

export const commentRoutes = Router()
const commentController = new CommentController()

// Rota para criar um comentário ou resposta
commentRoutes.post('/', (req, res) => commentController.createComment(req, res))

// Rota para listar os comentários de um capítulo específico
commentRoutes.get('/chapter/:chapterId', (req, res) =>
	commentController.getChapterComments(req, res)
)

// Rota para dar/remover like de um comentário
commentRoutes.post('/like', (req, res) => commentController.toggleCommentLike(req, res))

// Rota para denunciar um comentário
commentRoutes.post('/report', (req, res) => commentController.reportComment(req, res))

// Rota para o histórico de comentários do usuário (Perfil)
commentRoutes.get('/user/:userId', (req, res) => commentController.getUserComments(req, res))
