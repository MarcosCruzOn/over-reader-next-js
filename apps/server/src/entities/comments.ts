import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { mangas } from './mangas'

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	mangaId: integer('manga_id')
		.references(() => mangas.id)
		.notNull(),
	content: text('content').notNull(), // O texto do comentário
	createdAt: timestamp('created_at').defaultNow(),
})
