import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const mangas = pgTable('mangas', {
	id: serial('id').primaryKey(), // ID único gerado automaticamente
	title: varchar('title', { length: 255 }).notNull(), // Título
	author: varchar('author', { length: 255 }).notNull(), // Autor
	genres: varchar('genres', { length: 255 }).notNull(), // Gêneros (Shonen, Terror, etc)
	synopsis: text('synopsis').notNull(), // Sinopse (text permite textos longos)
	coverUrl: varchar('cover_url', { length: 500 }), // Capa (URL da imagem)
	status: varchar('status', { length: 50 }).notNull(), // Status (Em andamento / Completo)
	releaseYear: integer('release_year'), // Ano de lançamento
	publisher: varchar('publisher', { length: 255 }), // Editora
	createdAt: timestamp('created_at').defaultNow(), // Data de criação (bom para controle interno)
	updatedAt: timestamp('updated_at').defaultNow(),
})
