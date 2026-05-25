import { db } from '../db'
import { and, eq, sql, desc } from 'drizzle-orm'

import { comments, commentLikes, commentReports } from '../entities/comments'
import { users } from '../entities/users'
import { chapters } from '../entities/chapters'
import { volumes } from '../entities/volumes'
import { mangas } from '../entities/mangas'
import { notifications } from '../entities/notifications'

import { sendNotificationToUser } from '../utils/socket'
import { NotificationRepository } from './notificationRepository'

export type CreateCommentDTO = typeof comments.$inferInsert
export type CreateReportDTO = typeof commentReports.$inferInsert

export class CommentRepository {
	// 💬 CRIA COMENTÁRIO OU RESPOSTA
	async create(data: CreateCommentDTO, targetCommentId?: number) {
		const result = await db.insert(comments).values(data).returning()
		const newComment = result[0]

		// 🔥 AUTOMAÇÃO: Descobre quem realmente deve receber a notificação
		const notifyCommentId = targetCommentId || data.parentId

		if (notifyCommentId) {
			const targetQuery = await db
				.select({ userId: comments.userId })
				.from(comments)
				.where(eq(comments.id, notifyCommentId))
				.limit(1)

			const target = targetQuery[0]

			if (target) {
				const receiverId = target.userId

				if (receiverId !== data.userId) {
					const insertedNotif = await db
						.insert(notifications)
						.values({
							userId: receiverId,
							actorId: data.userId as string,
							type: 'REPLY',
							commentId: data.parentId || notifyCommentId,
							chapterId: data.chapterId as number,
						})
						.returning()

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
				manga: {
					title: mangas.title,
				},
				likesCount: sql<number>`(
					SELECT count(*) 
					FROM ${commentLikes} 
					WHERE ${commentLikes.commentId} = ${comments.id}
				)`,
			})
			.from(comments)
			.innerJoin(chapters, eq(comments.chapterId, chapters.id))
			.innerJoin(volumes, eq(chapters.volumeId, volumes.id))
			.innerJoin(mangas, eq(volumes.mangaId, mangas.id))
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

	// 🚨 LISTAGEM DE DENÚNCIAS (ADMIN)
	async getPendingReports() {
		return await db
			.select({
				id: commentReports.id,
				reason: commentReports.reason,
				createdAt: commentReports.createdAt,
				reporter: {
					id: users.id,
					name: users.name,
				},
				comment: {
					id: comments.id,
					text: comments.text,
				},
			})
			.from(commentReports)
			.innerJoin(users, eq(commentReports.userId, users.id))
			.innerJoin(comments, eq(commentReports.commentId, comments.id))
			.orderBy(desc(commentReports.createdAt))
	}

	// ⚖️ JULGAMENTO DA DENÚNCIA (ADMIN)
	async resolveReport(reportId: number, action: 'dismiss' | 'delete') {
		const report = await db
			.select()
			.from(commentReports)
			.where(eq(commentReports.id, reportId))
			.limit(1)

		if (!report[0]) throw new Error('Denúncia não encontrada.')

		if (action === 'delete') {
			// Se a decisão for "apagar", apagamos o comentário.
			// O Postgres apagará automaticamente as respostas, likes e a denúncia associada (em cascata)
			await db.delete(comments).where(eq(comments.id, report[0].commentId))
			return { message: 'Comentário apagado e denúncia resolvida.' }
		} else {
			// Se a decisão for "ignorar", apagamos apenas a denúncia para limpar o painel
			await db.delete(commentReports).where(eq(commentReports.id, reportId))
			return { message: 'Denúncia ignorada com sucesso.' }
		}
	}
}
