import { pgTable, serial, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './users'
import { mangas } from './mangas'

export const reviews = pgTable(
	'reviews',
	{
		id: serial('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		mangaId: integer('manga_id')
			.notNull()
			.references(() => mangas.id, { onDelete: 'cascade' }),
		rating: integer('rating').notNull(), // Ex: de 1 a 5
		comment: text('comment'), // Opinião escrita (Opcional)
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow(),
	},
	(table) => {
		return {
			// Um usuário só pode ter uma avaliação por mangá
			userMangaReviewIdx: uniqueIndex('user_manga_review_idx').on(
				table.userId,
				table.mangaId
			),
		}
	}
)
