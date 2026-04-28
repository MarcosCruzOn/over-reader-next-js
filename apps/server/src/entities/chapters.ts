import { pgTable, serial, integer, varchar, json, timestamp } from 'drizzle-orm/pg-core'
import { volumes } from './volumes'

export const chapters = pgTable('chapters', {
	id: serial('id').primaryKey(),
	volumeId: integer('volume_id')
		.references(() => volumes.id, { onDelete: 'cascade' })
		.notNull(),
	chapterNumber: integer('chapter_number').notNull(),
	title: varchar('title', { length: 255 }),
	pages: json('pages').notNull(), // Array de links das imagens do capítulo
	createdAt: timestamp('created_at').defaultNow(),
})
