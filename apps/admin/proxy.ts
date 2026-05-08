import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
	// 1. O segurança pede o crachá (lê os cookies)
	const token = request.cookies.get('token')?.value

	// 2. Verifica se a pessoa está tentando acessar a página de login
	const isLoginPage = request.nextUrl.pathname === '/login'

	// REGRA 1: Se não tem crachá e NÃO está na tela de login -> Chuta pro /login!
	if (!token && !isLoginPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// REGRA 2: Se já tem crachá e está tentando acessar o /login -> Manda pro Dashboard!
	if (token && isLoginPage) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// Se estiver tudo certo, libera a catraca
	return NextResponse.next()
}

// Configuração para dizer ao segurança QUAIS rotas ele deve vigiar
// Aqui dizemos: "Vigie TUDO, exceto arquivos de sistema como imagens, fontes e API do Next"
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
