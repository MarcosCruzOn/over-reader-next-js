'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { ArrowLeft } from 'lucide-react'

const IMAGES = [
	'https://i.pinimg.com/originals/1b/e9/ca/1be9ca06921eb7c3516ec3a39b7348ac.jpg',
	'https://i.pinimg.com/736x/0d/57/b4/0d57b43db35fa79be4a2216665847e35.jpg',
	'https://i.pinimg.com/originals/5b/11/39/5b1139f331116dfedc67628593ccb4e9.jpg',
	'https://i.pinimg.com/736x/71/e5/67/71e56787c10d6a56eb039596fb3fc6b2.jpg',
	'https://i.pinimg.com/736x/ca/fb/9d/cafb9d2ef331a920d9eee1f75c9b755e.jpg',
]

export default function LoginPage() {
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

	// Efeito do Carrossel
	React.useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
		}, 5000)
		return () => clearInterval(interval)
	}, [])
	return (
		<div className="min-h-screen bg-background flex flex-col md:flex-row">
			{/* LADO ESQUERDO - Imagem/Banner (Opcional, dá um toque premium) */}
			<div className="hidden md:flex md:w-1/2 bg-muted relative overflow-hidden">
				<Image
					src="https://placehold.co/1080x1920/1a1a1a/white.png?text=Over+Reader+Banner"
					alt="Over Reader"
					fill
					className="object-cover opacity-50"
					unoptimized
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
				<div className="absolute bottom-12 left-12 right-12 z-10">
					<h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
						Sua jornada <br />
						<span className="text-primary">começa aqui.</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-md">
						Acompanhe seus mangás favoritos, receba notificações de novos capítulos e
						participe da comunidade.
					</p>
				</div>
			</div>

			{/* LADO DIREITO - Formulário de Login */}
			<div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative">
				<Link
					href="/"
					className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors font-medium"
				>
					<ArrowLeft className="w-4 h-4" />
					Voltar ao início
				</Link>

				<div className="max-w-md w-full mx-auto space-y-8">
					<div className="text-center md:text-left">
						<h1 className="text-3xl font-black text-foreground uppercase tracking-tight mb-2">
							Acessar Conta
						</h1>
						<p className="text-muted-foreground font-medium">
							Bem-vindo de volta ao painel do leitor.
						</p>
					</div>

					{/* 🔵 BOTÃO DO GOOGLE (O que realmente funciona agora) */}
					<Button
						type="button"
						variant="outline"
						className="w-full h-12 text-base font-semibold border-border hover:bg-muted transition-all flex items-center justify-center gap-3"
						onClick={() => signIn('google', { callbackUrl: '/' })}
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Continuar com o Google
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-background px-4 text-muted-foreground font-medium">
								Ou acesse com email
							</span>
						</div>
					</div>

					{/* 📝 FORMULÁRIO EMAIL/SENHA (Visual para o futuro) */}
					<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="seu@email.com"
								className="h-12 bg-muted/50"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Senha</Label>
								<Link
									href="#"
									className="text-sm font-semibold text-primary hover:underline"
								>
									Esqueceu a senha?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								className="h-12 bg-muted/50"
							/>
						</div>
						<Button
							type="submit"
							className="w-full h-12 text-base font-bold bg-primary hover:bg-brand-dark text-white"
						>
							Entrar
						</Button>
					</form>

					<p className="text-center text-sm text-muted-foreground font-medium mt-6">
						Ainda não tem uma conta?{' '}
						<Link href="#" className="text-primary font-bold hover:underline">
							Criar conta
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
