import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'
import { chapters } from './chapters'
import { comments } from './comments'

export const notifications = pgTable('notifications', {
	id: serial('id').primaryKey(),

	// 🎯 RECEBEDOR: O usuário que vai ver a notificação no painel
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	// 🎭 ATOR: O usuário que apertou o botão de Like ou Respondeu
	actorId: text('actor_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),

	// 🏷️ TIPO DA AÇÃO: 'LIKE' ou 'REPLY'
	type: text('type').notNull(),

	// 💬 REFERÊNCIA: Qual foi o comentário afetado
	commentId: integer('comment_id')
		.notNull()
		.references(() => comments.id, { onDelete: 'cascade' }),

	// 📖 REDIRECIONAMENTO: Para qual capítulo o link deve levar quando clicado
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id, { onDelete: 'cascade' }),

	// 👁️ STATUS: Para a bolinha vermelha sumir depois que ele abrir o menu
	isRead: boolean('is_read').default(false),

	createdAt: timestamp('created_at').defaultNow(),
})
