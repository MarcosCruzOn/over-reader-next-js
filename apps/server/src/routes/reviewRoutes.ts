import { Router } from 'express'
import { ReviewController } from '../controllers/reviewController'

export const reviewRoutes = Router()
const reviewController = new ReviewController()

// 🔥 Unificado: Cria ou atualiza a nota (Substitui o POST '/' antigo)
reviewRoutes.post('/', (req, res) => reviewController.upsertReview(req, res))

// Busca todas as avaliações de um usuário específico (para a aba Perfil)
reviewRoutes.get('/user/:userId', (req, res) => reviewController.listByUser(req, res))

// Busca a nota específica que um usuário deu para um mangá específico
reviewRoutes.get('/user/:userId/:mangaId', (req, res) => reviewController.getUserRating(req, res))

// Obtém a média geral e total de votos da obra
reviewRoutes.get('/manga/:mangaId/stats', (req, res) => reviewController.getMangaStats(req, res))
