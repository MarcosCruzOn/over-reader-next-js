import { Router } from 'express'
import { NotificationController } from '../controllers/notificationController'

export const notificationRoutes = Router()
const controller = new NotificationController()

// Rota para listar notificações
notificationRoutes.get('/user/:userId', (req, res) => controller.getUserNotifications(req, res))

// Rota para marcar como lidas (limpar a bolinha vermelha)
notificationRoutes.patch('/user/:userId/read', (req, res) => controller.markAsRead(req, res))
