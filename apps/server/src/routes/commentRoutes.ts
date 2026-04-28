import { Router } from 'express'
import { CommentController } from '../controllers/commentController'

export const commentRoutes = Router()
const commentController = new CommentController()

commentRoutes.post('/', (req, res) => commentController.create(req, res))
