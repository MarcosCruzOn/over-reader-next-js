import type { Request, Response } from 'express'
import { NotificationRepository } from '../repositories/notificationRepository'

export class NotificationController {
	async getUserNotifications(req: Request, res: Response) {
		try {
			const { userId } = req.params
			const repository = new NotificationRepository()
			const notifs = await repository.getUserNotifications(userId as string)
			res.json(notifs)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async markAsRead(req: Request, res: Response) {
		try {
			const { userId } = req.params
			const repository = new NotificationRepository()
			await repository.markAllAsRead(userId as string)
			res.json({ success: true })
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
