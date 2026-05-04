import { db } from '../db'
import { users } from '../entities/users'
import { eq } from 'drizzle-orm'

export type CreateUserDTO = typeof users.$inferInsert

export class UserRepository {
	async create(data: CreateUserDTO) {
		const result = await db.insert(users).values(data).returning()
		return result[0]
	}

	// Busca todos os usuários
	async findAll() {
		return await db.select().from(users)
	}

	// Atualiza apenas o status de um usuário pelo ID
	async updateStatus(id: number, status: string) {
		const result = await db.update(users).set({ status }).where(eq(users.id, id)).returning()
		return result[0]
	}

	// Atualiza a foto de perfil
	async updateAvatar(id: number, avatarUrl: string) {
		const result = await db.update(users).set({ avatarUrl }).where(eq(users.id, id)).returning()
		return result[0]
	}
}
