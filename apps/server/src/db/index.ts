import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import * as usersSchema from '../entities/users'
import * as mangasSchema from '../entities/mangas'
import * as chaptersSchema from '../entities/chapters'
import * as volumesSchema from '../entities/volumes'
import * as favoritesSchema from '../entities/favorites'
import * as reviewsSchema from '../entities/reviews'
import * as commentsSchema from '../entities/comments'

dotenv.config()

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

// O "schema" ensina ao Drizzle o mapa completo do seu banco!
export const schema = {
	...usersSchema,
	...mangasSchema,
	...chaptersSchema,
	...volumesSchema,
	...favoritesSchema,
	...reviewsSchema,
	...commentsSchema,
}

export const db = drizzle(pool, { schema })
