import { db } from '../db'
import { and, eq, sql } from 'drizzle-orm'

import { comments, commentLikes, commentReports } from '../entities/comments'
import { users } from '../entities/users'
import { chapters } from '../entities/chapters'
import { notifications } from '../entities/notifications'

import { sendNotificationToUser } from '../utils/socket'
import { NotificationRepository } from './notificationRepository'

export type CreateCommentDTO = typeof comments.$inferInsert
export type CreateReportDTO = typeof commentReports.$inferInsert

export class CommentRepository {
	// 💬 CRIA COMENTÁRIO OU RESPOSTA
	async create(data: CreateCommentDTO) {
		const result = await db.insert(comments).values(data).returning()
		const newComment = result[0]

		// 🔥 AUTOMAÇÃO: Se for uma resposta (tem parentId), gera notificação!
		if (data.parentId) {
			const parentComment = await db
				.select({ userId: comments.userId })
				.from(comments)
				.where(eq(comments.id, data.parentId))
				.limit(1)

			const parent = parentComment[0]

			if (parent) {
				const receiverId = parent.userId

				if (receiverId !== data.userId) {
					const insertedNotif = await db
						.insert(notifications)
						.values({
							userId: receiverId,
							actorId: data.userId as string,
							type: 'REPLY',
							commentId: data.parentId,
							chapterId: data.chapterId as number,
						})
						.returning()

					// 🔥 GATILHO EM TEMPO REAL
					const notifId = insertedNotif[0]?.id
					if (notifId) {
						const notifRepo = new NotificationRepository()
						const fullNotif = await notifRepo.getNotificationById(notifId)
						if (fullNotif) sendNotificationToUser(receiverId, fullNotif)
					}
				}
			}
		}

		return newComment
	}

	// 🔥 LISTAGEM DE COMENTÁRIOS NO LEITOR
	async getCommentsByChapter(chapterId: number, currentUserId?: string) {
		const result = await db
			.select({
				id: comments.id,
				text: comments.text,
				parentId: comments.parentId,
				createdAt: comments.createdAt,
				user: {
					id: users.id,
					name: users.name,
					image: users.image,
				},
				likesCount: sql<number>`(
					SELECT count(*) 
					FROM ${commentLikes} 
					WHERE ${commentLikes.commentId} = ${comments.id}
				)`,
				isLiked: currentUserId
					? sql<boolean>`EXISTS(
						SELECT 1 FROM ${commentLikes} 
						WHERE ${commentLikes.commentId} = ${comments.id} 
						AND ${commentLikes.userId} = ${currentUserId}
					)`
					: sql<boolean>`false`,
			})
			.from(comments)
			.innerJoin(users, eq(comments.userId, users.id))
			.where(eq(comments.chapterId, chapterId))
			.orderBy(comments.createdAt)

		return result.map((item) => ({
			...item,
			likesCount: Number(item.likesCount) || 0,
			isLiked: !!item.isLiked,
		}))
	}

	// 👤 LISTAGEM NO PERFIL DO UTILIZADOR
	async getCommentsByUser(userId: string) {
		const result = await db
			.select({
				id: comments.id,
				text: comments.text,
				createdAt: comments.createdAt,
				chapterId: comments.chapterId,
				chapter: {
					chapterNumber: chapters.chapterNumber,
				},
				likesCount: sql<number>`(
					SELECT count(*) 
					FROM ${commentLikes} 
					WHERE ${commentLikes.commentId} = ${comments.id}
				)`,
			})
			.from(comments)
			.innerJoin(chapters, eq(comments.chapterId, chapters.id))
			.where(eq(comments.userId, userId))
			.orderBy(sql`${comments.createdAt} DESC`)

		return result.map((item) => ({
			...item,
			likesCount: Number(item.likesCount) || 0,
		}))
	}

	// ❤️ GERENCIADOR DE CURTIDAS (Com Automação de Notificação)
	async toggleLike(userId: string, commentId: number) {
		const existingLike = await db
			.select()
			.from(commentLikes)
			.where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
			.limit(1)

		if (existingLike.length > 0) {
			// Se já curtiu, apenas remove a curtida (não removemos a notificação antiga para manter o histórico, mas pode ser feito se desejar)
			await db
				.delete(commentLikes)
				.where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
			return { liked: false }
		} else {
			// Se é um Like novo, insere na tabela
			await db.insert(commentLikes).values({ userId, commentId })

			// 🔥 AUTOMAÇÃO: Gera a notificação de Like
			const commentData = await db
				.select({ userId: comments.userId, chapterId: comments.chapterId })
				.from(comments)
				.where(eq(comments.id, commentId))
				.limit(1)

			const targetComment = commentData[0]

			if (targetComment) {
				const receiverId = targetComment.userId

				if (receiverId !== userId) {
					const insertedNotif = await db
						.insert(notifications)
						.values({
							userId: receiverId,
							actorId: userId,
							type: 'LIKE',
							commentId: commentId,
							chapterId: targetComment.chapterId,
						})
						.returning()

					// 🔥 GATILHO EM TEMPO REAL
					const notifId = insertedNotif[0]?.id
					if (notifId) {
						const notifRepo = new NotificationRepository()
						const fullNotif = await notifRepo.getNotificationById(notifId)
						if (fullNotif) sendNotificationToUser(receiverId, fullNotif)
					}
				}
			}

			return { liked: true }
		}
	}

	// 🚨 REGISTRADOR DE DENÚNCIAS
	async createReport(data: CreateReportDTO) {
		const result = await db.insert(commentReports).values(data).returning()
		return result[0]
	}
}
