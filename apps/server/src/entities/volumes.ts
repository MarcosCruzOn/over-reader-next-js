import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core'
import { mangas } from './mangas'

export const volumes = pgTable('volumes', {
	id: serial('id').primaryKey(),
	mangaId: integer('manga_id')
		.references(() => mangas.id, { onDelete: 'cascade' })
		.notNull(),
	volumeNumber: integer('volume_number').notNull(),
	title: varchar('title', { length: 255 }), // Ex: "O Início"
	createdAt: timestamp('created_at').defaultNow(),
})
