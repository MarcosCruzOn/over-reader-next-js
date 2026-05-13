import { pgTable, serial, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './users'
import { mangas } from './mangas'

export const favorites = pgTable(
	'favorites',
	{
		id: serial('id').primaryKey(),
		// userId agora é text para bater com o NextAuth (Google)
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		// mangaId continua integer
		mangaId: integer('manga_id')
			.notNull()
			.references(() => mangas.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow(),
	},
	(table) => {
		return {
			// Impede que o mesmo usuário favorite o mesmo mangá duas vezes
			userMangaIdx: uniqueIndex('user_manga_idx').on(table.userId, table.mangaId),
		}
	}
)
