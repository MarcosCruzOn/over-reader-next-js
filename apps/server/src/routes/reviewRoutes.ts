import { Router } from 'express'
import { ReviewController } from '../controllers/reviewController'

export const reviewRoutes = Router()
const reviewController = new ReviewController()

reviewRoutes.post('/', (req, res) => reviewController.create(req, res))
