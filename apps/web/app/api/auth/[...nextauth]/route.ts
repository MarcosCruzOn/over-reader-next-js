import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { sql } from 'drizzle-orm' // 🔥 IMPORTAMOS O SQL PURO

import { db } from '@workspace/server/db'

const authOptions = {
	adapter: DrizzleAdapter(db),

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt' as const,
	},
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, trigger, session, user }) {
			// Se o user existir, é o exato momento do Login
			if (user) {
				token.sub = user.id
				token.picture = user.image

				// 🔥 BUSCA BRUTA (Bypass no NextAuth e no Turborepo)
				// Vamos direto ao banco de dados ler a coluna banner_url usando SQL puro
				try {
					if (user.email) {
						// Usamos aspas duplas em "user" porque user é uma palavra reservada no Postgres
						const result = await db.execute(
							sql`SELECT banner_url FROM "user" WHERE email = ${user.email} LIMIT 1`
						)

						// Se encontrou a linha e a coluna não está vazia, injetamos no token!
						if (result.rows.length > 0 && result.rows[0].banner_url) {
							token.bannerUrl = result.rows[0].banner_url
						}
					}
				} catch (error) {
					console.error('Erro na busca SQL do banner:', error)
				}
			}

			// Se o frontend chamou o update()
			if (trigger === 'update' && session) {
				if (session.image) token.picture = session.image
				if (session.bannerUrl) token.bannerUrl = session.bannerUrl
			}

			return token
		},

		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub as string
			}
			if (session.user && token.picture) {
				session.user.image = token.picture as string
			}
			if (session.user && token.bannerUrl) {
				;(session.user as any).bannerUrl = token.bannerUrl as string
			}

			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
