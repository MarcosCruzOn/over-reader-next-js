import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(), // unique impede emails repetidos
	role: varchar('role', { length: 50 }).default('USER'), // user, admin, moderator
	status: varchar('status', { length: 50 }).default('ativo'), // ativo, banido, suspenso
	createdAt: timestamp('created_at').defaultNow(),
	lastAccess: timestamp('last_access').defaultNow(),
})
