import NextAuth, { User, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { sql } from 'drizzle-orm'
import { JWT } from 'next-auth/jwt'

import { db } from '@workspace/server/db'

// 🔥 1. Criamos tipagens estritas para remover o "any"
interface CustomToken extends JWT {
	bannerUrl?: string
	picture?: string | null
	sub?: string
}

interface CustomSession extends Session {
	user: {
		id: string
		name?: string | null
		email?: string | null
		image?: string | null
		bannerUrl?: string
	}
}

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
		// 🔥 2. Aplicamos a tipagem no lugar do "any"
		async jwt({
			token,
			trigger,
			session,
			user,
		}: {
			token: CustomToken
			trigger?: 'signIn' | 'signUp' | 'update'
			session?: CustomSession
			user?: User
		}) {
			if (user) {
				token.sub = user.id
				token.picture = user.image

				try {
					if (user.email) {
						const result = await db.execute(
							sql`SELECT banner_url FROM "user" WHERE email = ${user.email} LIMIT 1`
						)

						// 🔥 3. Verificação cega e segura contra null/undefined
						if (result && result.rows && result.rows.length > 0) {
							// Dizemos ao TS o formato exato da linha do banco
							const row = result.rows[0] as { banner_url?: string | null }

							if (row && row.banner_url) {
								token.bannerUrl = row.banner_url
							}
						}
					}
				} catch (error) {
					console.error('Erro na busca SQL do banner:', error)
				}
			}

			if (trigger === 'update' && session?.user) {
				if (session.user.image) token.picture = session.user.image
				if (session.user.bannerUrl) token.bannerUrl = session.user.bannerUrl
			}

			return token
		},

		// 🔥 4. Aplicamos a tipagem aqui também
		async session({ session, token }: { session: Session; token: CustomToken }) {
			const customSession = session as CustomSession

			if (customSession.user && token.sub) {
				customSession.user.id = token.sub
			}
			if (customSession.user && token.picture) {
				customSession.user.image = token.picture
			}
			if (customSession.user && token.bannerUrl) {
				customSession.user.bannerUrl = token.bannerUrl
			}

			return customSession
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
