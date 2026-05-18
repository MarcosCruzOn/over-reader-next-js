'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bookmark, MessageSquare, Star, Settings, Camera, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

import Image from 'next/image'

export default function PerfilPage() {
	// 🔥 Adicionamos o 'update' para podermos recarregar a sessão do NextAuth em tempo real
	const { data: session, status, update } = useSession()
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('favorites')

	const [favorites, setFavorites] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isUploading, setIsUploading] = useState(false) // Estado para o loading do avatar

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status, router])

	// 🔥 A MAGIA DO UPLOAD ACONTECE AQUI
	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// O DrizzleAdapter coloca o id dentro do session.user, mas o TypeScript do NextAuth não sabe disso por padrão.
		// Fazemos um 'as any' rápido para contornar o aviso tipográfico.
		const userId = (session?.user as any)?.id

		if (!userId) {
			alert('Erro de sessão: ID do usuário não encontrado.')
			return
		}

		try {
			setIsUploading(true)
			const formData = new FormData()
			formData.append('avatar', file) // Tem que ser 'avatar' para bater com o uploadConfig.single('avatar')

			// Envia para o backend
			const response = await fetch(`http://localhost:3333/users/${userId}/avatar`, {
				method: 'PATCH',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Falha ao enviar a imagem para o servidor')
			}

			const updatedUser = await response.json()

			// Avisa ao NextAuth: "Ei, atualize a sessão local com essa nova imagem!"
			await update({ image: updatedUser.image })
		} catch (error) {
			console.error(error)
			alert('Ocorreu um erro ao atualizar a foto de perfil.')
		} finally {
			setIsUploading(false)
		}
	}

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				Carregando o seu universo...
			</div>
		)
	}

	if (!session?.user) return null

	return (
		<div className="min-h-screen bg-background text-foreground pb-20">
			{/* HEADER DO PERFIL */}
			<div className="relative h-64 bg-muted overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-purple-900/80" />
				<Image
					src="https://placehold.co/1920x400/1a1a1a/333333.png?text=+"
					alt="Banner"
					className="w-full h-full object-cover mix-blend-overlay opacity-50"
					loading="eager"
					fill
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
				<div className="flex flex-col md:flex-row gap-8">
					{/* SIDEBAR */}
					<div className="w-full md:w-80 shrink-0">
						<div className="bg-card border border-border rounded-xl p-6 shadow-2xl backdrop-blur-sm">
							<div className="relative w-32 h-32 mx-auto -mt-16 mb-4 group">
								<Image
									src={
										session.user.image ||
										'https://placehold.co/200x200/1a1a1a/white.png?text=U'
									}
									alt="Avatar"
									className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg"
									referrerPolicy="no-referrer"
									loading="eager"
									fill
									unoptimized={true}
								/>

								{/* Camada escura que aparece ao passar o mouse */}
								<label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
									{isUploading ? (
										<Loader2 className="w-8 h-8 text-white animate-spin" />
									) : (
										<>
											<Camera className="w-8 h-8 text-white mb-1" />
											<span className="text-white text-xs font-bold">
												Mudar
											</span>
										</>
									)}
									{/* O Input de arquivo conectado à nossa função */}
									<input
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleAvatarUpload}
										disabled={isUploading}
									/>
								</label>
							</div>

							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-foreground">
									{session.user.name}
								</h1>
								<p className="text-muted-foreground text-sm">
									{session.user.email}
								</p>
								<div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
									Leitor Nvl. 1
								</div>
							</div>

							<div className="space-y-2">
								<Button
									variant={activeTab === 'favorites' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('favorites')}
								>
									<Bookmark className="w-5 h-5 mr-3" /> Favoritos
								</Button>
								<Button
									variant={activeTab === 'reviews' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('reviews')}
								>
									<Star className="w-5 h-5 mr-3" /> Minhas Avaliações
								</Button>
								<Button
									variant={activeTab === 'comments' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('comments')}
								>
									<MessageSquare className="w-5 h-5 mr-3" /> Comentários
								</Button>
								<div className="my-4 border-t border-border" />
								<Button
									variant={activeTab === 'settings' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold text-muted-foreground"
									onClick={() => setActiveTab('settings')}
								>
									<Settings className="w-5 h-5 mr-3" /> Configurações
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10"
									onClick={() => signOut({ callbackUrl: '/' })}
								>
									<LogOut className="w-5 h-5 mr-3" /> Sair da conta
								</Button>
							</div>
						</div>
					</div>

					{/* ÁREA DE CONTEÚDO */}
					<div className="flex-1 mt-8 md:mt-0">
						{activeTab === 'favorites' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minha Biblioteca
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
									{/* Temporariamente vazio até ligarmos o backend */}
									<div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
										<Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
										<p>Sua biblioteca está vazia.</p>
										<p className="text-sm">
											Encontre mangás incríveis e adicione-os aos favoritos!
										</p>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minhas Avaliações
								</h2>
								<div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
									<Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
									<p>Você ainda não avaliou nenhum mangá.</p>
								</div>
							</div>
						)}

						{activeTab === 'settings' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Configurações
								</h2>
								<div className="bg-card border border-border rounded-xl p-6 space-y-6">
									<div className="space-y-2">
										<label className="text-sm font-bold text-muted-foreground uppercase">
											Nome de Exibição
										</label>
										<Input
											defaultValue={session.user.name || ''}
											className="bg-background border-border"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-bold text-muted-foreground uppercase">
											E-mail (Vinculado ao Google)
										</label>
										<Input
											defaultValue={session.user.email || ''}
											disabled
											className="bg-muted/50 cursor-not-allowed text-muted-foreground border-border"
										/>
									</div>
									<Button className="bg-primary text-white font-bold hover:bg-brand-dark">
										Salvar Alterações
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
