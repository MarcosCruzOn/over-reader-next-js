import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { chapters } from './chapters'

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	chapterId: integer('chapter_id')
		.notNull()
		.references(() => chapters.id, { onDelete: 'cascade' }),
	text: text('text').notNull(), // O texto do comentário
	createdAt: timestamp('created_at').defaultNow(),
})
