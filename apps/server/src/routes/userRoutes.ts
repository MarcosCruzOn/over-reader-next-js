import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { uploadConfig } from '../config/upload'

export const userRoutes = Router()
const userController = new UserController()

userRoutes.post('/', (req, res) => userController.create(req, res))
userRoutes.get('/', (req, res) => userController.list(req, res))
userRoutes.patch('/:id/status', (req, res) => userController.changeStatus(req, res))

// NOVA ROTA DE UPLOAD: O "single('avatar')" diz que esperamos um campo chamado "avatar" contendo 1 arquivo
userRoutes.patch('/:id/avatar', uploadConfig.single('avatar'), (req, res) =>
	userController.updateAvatar(req, res)
)
