'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Library, Loader2 } from 'lucide-react'

const IMAGES = [
	'https://i.pinimg.com/originals/1b/e9/ca/1be9ca06921eb7c3516ec3a39b7348ac.jpg',
	'https://i.pinimg.com/736x/0d/57/b4/0d57b43db35fa79be4a2216665847e35.jpg',
	'https://i.pinimg.com/originals/5b/11/39/5b1139f331116dfedc67628593ccb4e9.jpg',
	'https://i.pinimg.com/736x/71/e5/67/71e56787c10d6a56eb039596fb3fc6b2.jpg',
	'https://i.pinimg.com/736x/ca/fb/9d/cafb9d2ef331a920d9eee1f75c9b755e.jpg',
]

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const router = useRouter()

	// Estados da Interface
	const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

	// Estados do Formulário
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	// Efeito do Carrossel
	React.useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length)
		}, 5000)
		return () => clearInterval(interval)
	}, [])

	// 🔥 A FUNÇÃO MÁGICA DE LOGIN
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const res = await fetch('http://localhost:3333/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Erro ao fazer login. Verifique suas credenciais.')
			}

			// Salva o Token (Crachá) nos Cookies do navegador! (Válido por 7 dias)
			document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7};`

			// Redireciona com sucesso para o Painel Principal (Dashboard)
			router.push('/')
			router.refresh() // Atualiza a página para o Next.js recalcular as rotas
		} catch (error: any) {
			alert(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className="overflow-hidden p-0 border-border/50 shadow-lg">
				<CardContent className="grid p-0 md:grid-cols-2">
					{/* LADO ESQUERDO: Formulário (Agora com o onSubmit apontando para nossa função) */}
					<form
						onSubmit={handleLogin}
						className="p-6 md:p-12 flex flex-col justify-center "
					>
						<FieldGroup className="gap-6">
							<div className="flex flex-col items-center gap-2 text-center mb-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm mb-2">
									<Library className="h-7 w-7" />
								</div>
								<h1 className="text-2xl font-black tracking-tight uppercase">
									OVER Reader
								</h1>
								<p className="text-balance text-muted-foreground text-sm">
									Acesso restrito ao Painel Administrativo
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="email">E-mail Corporativo</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="admin@overreader.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-11"
								/>
							</Field>

							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Senha</FieldLabel>
									<a
										href="#"
										className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-primary transition-colors"
									>
										Esqueceu a senha?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="h-11"
								/>
							</Field>

							<Field className="pt-2">
								<Button
									type="submit"
									className="w-full h-11 font-bold text-md"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
											Conectando...
										</>
									) : (
										'Entrar no Sistema'
									)}
								</Button>
							</Field>
						</FieldGroup>
					</form>

					{/* LADO DIREITO: Imagens/Vídeos Animados */}
					<div className="relative hidden bg-muted md:block overflow-hidden">
						{IMAGES.map((src, index) => {
							const isVideo = src.toLowerCase().includes('.mp4')

							return isVideo ? (
								<video
									key={src}
									src={src}
									autoPlay
									loop
									muted
									playsInline
									className={cn(
										'absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out dark:brightness-[0.6]',
										currentImageIndex === index
											? 'opacity-100 scale-100'
											: 'opacity-0 scale-105'
									)}
								/>
							) : (
								<img
									key={src}
									src={src}
									alt="Background"
									className={cn(
										'absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out dark:brightness-[0.6]',
										currentImageIndex === index
											? 'opacity-100 scale-100'
											: 'opacity-0 scale-105'
									)}
								/>
							)
						})}
						<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
					</div>
				</CardContent>
			</Card>

			<p className="px-6 text-center text-xs text-muted-foreground">
				Ao prosseguir, você concorda em manter o sigilo dos dados do{' '}
				<a href="#" className="underline hover:text-primary">
					Over Reader
				</a>
				.
			</p>
		</div>
	)
}
