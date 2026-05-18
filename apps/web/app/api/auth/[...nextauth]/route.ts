import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

import { db } from '@workspace/server/db'

const authOptions = {
	// Ligamos o banco de dados ao NextAuth!
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
		// 1. O JWT pega os dados do Banco (user) e guarda no Cookie (token)
		async jwt({ token, trigger, session, user }) {
			// LOG DE DEBUG: Vamos ver o que o banco está a devolver no login!
			if (user) {
				console.log('DADOS DO USUÁRIO NO LOGIN:', user)

				// Forçamos o token a guardar o que vem do banco
				token.sub = user.id
				token.picture = user.image
				// O Drizzle pode retornar como bannerUrl (camelCase) ou banner_url (snake_case)
				// Depende de como você configurou o schema. Vamos tentar pegar os dois para garantir!
				token.bannerUrl = (user as any).bannerUrl || (user as any).banner_url
			}

			// Quando o frontend pede para atualizar via update()
			if (trigger === 'update' && session) {
				if (session.image) token.picture = session.image
				if (session.bannerUrl) token.bannerUrl = session.bannerUrl
			}

			return token
		},

		// 2. A Session pega os dados do Cookie (token) e manda para o Frontend
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub as string
			}
			if (session.user && token.picture) {
				session.user.image = token.picture as string
			}
			// Injeta o banner na sessão do frontend
			if (session.user && token.bannerUrl) {
				;(session.user as any).bannerUrl = token.bannerUrl as string
			}

			// LOG DE DEBUG: Ver o que está a chegar no frontend
			console.log('SESSÃO ENVIADA PARA O FRONTEND:', session.user)

			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
