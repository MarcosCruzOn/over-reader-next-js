import { pgTable, serial, text, integer, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { users } from './users'
import { chapters } from './chapters'

// 💬 1. Tabela Principal de Comentários
export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id, { onDelete: 'cascade' }),
	// 🔥 parentId: Se estiver preenchido, significa que este comentário é uma RESPOSTA a outro comentário
	parentId: integer('parent_id').references((): any => comments.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
})

// ❤️ 2. Tabela de Curtidas (Impede que a mesma pessoa curta 10 vezes)
export const commentLikes = pgTable(
	'comment_likes',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		commentId: integer('comment_id')
			.notNull()
			.references(() => comments.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => {
		// A chave primária composta garante que um usuário só pode ter 1 like por comentário
		return [primaryKey({ columns: [table.userId, table.commentId] })]
	}
)

// 🚨 3. Tabela de Denúncias (Moderação)
export const commentReports = pgTable('comment_reports', {
	id: serial('id').primaryKey(),
	userId: text('user_id') // Quem denunciou
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	commentId: integer('comment_id') // O comentário denunciado
		.notNull()
		.references(() => comments.id, { onDelete: 'cascade' }),
	reason: text('reason').notNull(), // Ex: "Discurso de Ódio", "Spoiler"
	status: text('status').default('PENDING'), // PENDING, REVIEWED, DISMISSED
	createdAt: timestamp('created_at').defaultNow(),
})
