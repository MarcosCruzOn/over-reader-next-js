import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

// Importe a sua conexão com o banco de dados aqui!
// Ajuste este caminho conforme a estrutura do seu monorepo.
import { db } from '@workspace/server/db'

const authOptions = {
	// 🔥 AQUI ESTÁ A MÁGICA: Ligamos o banco de dados ao NextAuth!
	adapter: DrizzleAdapter(db),

	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		// Quando usamos um banco de dados, a estratégia padrão muda para "database".
		// Mas como o seu backend (Node/Express) vai precisar ler esse token depois,
		// forçamos o uso de "jwt" (JSON Web Token) para facilitar a comunicação.
		strategy: 'jwt' as const,
	},
	pages: {
		signIn: '/login', // Redireciona para a nossa página customizada
	},
	callbacks: {
		// Este callback permite que o ID do usuário fique disponível em todo o frontend
		async session({ session, token }: any) {
			if (session.user && token.sub) {
				session.user.id = token.sub
			}
			return session
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
