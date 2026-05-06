import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const mangas = pgTable('mangas', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	author: varchar('author', { length: 255 }).notNull(),
	genres: varchar('genres', { length: 255 }).notNull(),
	synopsis: text('synopsis').notNull(),
	coverUrl: varchar('cover_url', { length: 500 }),
	bannerUrl: varchar('banner_url', { length: 500 }), // NOVO CAMPO: Banner!
	status: varchar('status', { length: 50 }).notNull(),
	releaseYear: integer('release_year').notNull(), // AGORA É OBRIGATÓRIO (notNull)
	publisher: varchar('publisher', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
})
