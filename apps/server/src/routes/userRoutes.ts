import { Router } from 'express'
import { UserController } from '../controllers/userController'

export const userRoutes = Router()
const userController = new UserController()

userRoutes.post('/', (req, res) => userController.create(req, res))
userRoutes.get('/', (req, res) => userController.list(req, res))
userRoutes.patch('/:id/status', (req, res) => userController.changeStatus(req, res))
