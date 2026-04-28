import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { mangas } from './mangas'

export const favorites = pgTable('favorites', {
	id: serial('id').primaryKey(),
	// O "references" é a nossa Chave Estrangeira. Ele avisa o banco que este ID deve existir na tabela de usuários!
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	mangaId: integer('manga_id')
		.references(() => mangas.id)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
})
