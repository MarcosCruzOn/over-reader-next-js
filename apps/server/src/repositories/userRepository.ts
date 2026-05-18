import { db } from '../db'
import { users } from '../entities/users'
import { eq } from 'drizzle-orm'

export type CreateUserDTO = typeof users.$inferInsert

export class UserRepository {
	async create(data: CreateUserDTO) {
		const result = await db.insert(users).values(data).returning()
		return result[0]
	}

	async findAll() {
		// 🔥 Nova sintaxe RQ! Muito mais limpa
		return await db.query.users.findMany()
	}

	// ⚠️ ATENÇÃO: id agora é STRING por causa do NextAuth/Google
	async updateStatus(id: string, status: string) {
		const result = await db.update(users).set({ status }).where(eq(users.id, id)).returning()
		return result[0]
	}

	async updateAvatar(id: string, avatarUrl: string) {
		const result = await db
			.update(users)
			.set({ image: avatarUrl })
			.where(eq(users.id, id))
			.returning()
		return result[0]
	}

	async updateBanner(id: string, bannerUrl: string) {
		const result = await db.update(users).set({ bannerUrl }).where(eq(users.id, id)).returning()
		return result[0]
	}

	async findByEmail(email: string) {
		// 🔥 Nova sintaxe RQ
		return await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		})
	}
}
