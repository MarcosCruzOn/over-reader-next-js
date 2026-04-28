import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { mangas } from './mangas'

export const reviews = pgTable('reviews', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	mangaId: integer('manga_id')
		.references(() => mangas.id)
		.notNull(),
	rating: integer('rating').notNull(), // A nota (ex: 1, 2, 3, 4 ou 5)
	createdAt: timestamp('created_at').defaultNow(),
})
