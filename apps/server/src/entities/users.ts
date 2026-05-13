import { pgTable, text, varchar, timestamp, primaryKey, integer } from 'drizzle-orm/pg-core'

// 👤 1. Tabela Principal de Usuários (A SUA TABELA MESCLADA)
export const users = pgTable('user', {
	// Usamos texto com UUID para ser compatível com as contas do Google/Facebook
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }), // ⬅️ Exigido pelo NextAuth

	// A password agora é opcional, pois quem logar com Google não terá password aqui
	password: varchar('password', { length: 255 }),

	// Mudei de 'avatarUrl' para 'image' para o NextAuth preencher automaticamente com a foto do Google
	image: varchar('image', { length: 500 }),

	// 👇 SUAS COLUNAS ORIGINAIS MANTIDAS INTACTAS
	role: varchar('role', { length: 50 }).default('USER'),
	status: varchar('status', { length: 50 }).default('ATIVO'),
	createdAt: timestamp('created_at').defaultNow(),
	lastAccess: timestamp('last_access').defaultNow(),
})

// 🔗 2. Tabela de Contas (Guarda o vínculo com Google, Facebook, etc)
export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(), // Ex: "google", "facebook"
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })]
)

// 🔑 3. Tabela de Sessões (Controla quem está logado no momento)
export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// ✉️ 4. Tabela de Tokens de Verificação (Para login sem senha / Magic Links / Reset de Senha)
export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
)
