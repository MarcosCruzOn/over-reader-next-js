import { pgTable, serial, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './users'
import { chapters } from './chapters' // Importe a sua tabela de capítulos

export const favoriteChapters = pgTable(
	'favorite_chapters',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		// Agora ligamos diretamente ao ID do Capítulo!
		chapterId: integer('chapter_id')
			.notNull()
			.references(() => chapters.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => {
		return {
			// Impede que o utilizador favorite o mesmo capítulo duas vezes
			userChapterIdx: uniqueIndex('user_chapter_idx').on(table.userId, table.chapterId),
		}
	}
)
