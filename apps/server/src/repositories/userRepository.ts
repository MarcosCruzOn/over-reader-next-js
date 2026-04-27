import { db } from '../db'
import { users } from '../entities/users'

export type CreateUserDTO = typeof users.$inferInsert

export class UserRepository {
	async create(data: CreateUserDTO) {
		const result = await db.insert(users).values(data).returning()
		return result[0]
	}
}
