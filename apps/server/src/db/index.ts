import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Cria um "pool" (uma fila de conexões) com o banco de dados
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

// Exporta o banco configurado para usarmos no restante do app
export const db = drizzle(pool)
