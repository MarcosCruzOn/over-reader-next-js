import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
	schema: './src/entities/*', // Onde estão nossas tabelas
	out: './drizzle', // Onde ele vai salvar o histórico de mudanças (migrations)
	dialect: 'postgresql', // Qual banco estamos usando
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
})
