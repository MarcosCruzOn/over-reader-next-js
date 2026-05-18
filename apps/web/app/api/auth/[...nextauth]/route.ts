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
		// 1. O JWT controla o que fica guardado no "crachá" do usuário no navegador
		async jwt({ token, trigger, session }: any) {
			// Quando o frontend chama update({ image: 'nova_url' }), o trigger vem como 'update'
			if (trigger === 'update' && session?.image) {
				// O NextAuth usa 'picture' por padrão no token para guardar a imagem
				token.picture = session.image
			}
			return token
		},

		// 2. A Session pega o que está no JWT e entrega para o frontend
		async session({ session, token }: any) {
			if (session.user && token.sub) {
				session.user.id = token.sub as string
			}
			// Garante que a imagem atualizada do token seja passada para a tela
			if (session.user && token.picture) {
				session.user.image = token.picture as string
			}
			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
