import { db } from '../db'
import { eq, desc } from 'drizzle-orm'
import { notifications } from '../entities/notifications'
import { users } from '../entities/users'
import { chapters } from '../entities/chapters'

export class NotificationRepository {
	// 🔔 Busca as notificações recentes do utilizador
	async getUserNotifications(userId: string) {
		return await db
			.select({
				id: notifications.id,
				type: notifications.type,
				isRead: notifications.isRead,
				createdAt: notifications.createdAt,
				// Trazemos os dados do "Ator" (quem curtiu/respondeu)
				actor: {
					name: users.name,
					image: users.image,
				},
				// Trazemos os dados do Capítulo para o frontend montar o Link
				chapter: {
					chapterNumber: chapters.chapterNumber,
				},
			})
			.from(notifications)
			.innerJoin(users, eq(notifications.actorId, users.id))
			.innerJoin(chapters, eq(notifications.chapterId, chapters.id))
			.where(eq(notifications.userId, userId))
			.orderBy(desc(notifications.createdAt))
			.limit(20) // Limite de 20 para não sobrecarregar o painel
	}

	// 👁️ Marca todas as notificações de um utilizador como lidas
	async markAllAsRead(userId: string) {
		await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId))
	}

	// 🔍 Busca uma única notificação detalhada para envio imediato via WebSocket
	async getNotificationById(id: number) {
		const result = await db
			.select({
				id: notifications.id,
				type: notifications.type,
				isRead: notifications.isRead,
				createdAt: notifications.createdAt,
				actor: {
					name: users.name,
					image: users.image,
				},
				chapter: {
					chapterNumber: chapters.chapterNumber,
				},
			})
			.from(notifications)
			.innerJoin(users, eq(notifications.actorId, users.id))
			.innerJoin(chapters, eq(notifications.chapterId, chapters.id))
			.where(eq(notifications.id, id))
			.limit(1)

		return result[0]
	}
}
