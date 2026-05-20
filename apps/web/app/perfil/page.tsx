'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
	Bookmark,
	MessageSquare,
	Star,
	Settings,
	Camera,
	LogOut,
	Loader2,
	ArrowLeft,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

import Image from 'next/image'
import Link from 'next/link'

export default function PerfilPage() {
	const { data: session, status, update } = useSession()
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('favorites')

	const [favorites, setFavorites] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingFavs, setIsLoadingFavs] = useState(false)
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
	const [isUploadingBanner, setIsUploadingBanner] = useState(false) // 🔥 Novo estado para o banner

	useEffect(() => {
		const fetchFavorites = async () => {
			if (session?.user && activeTab === 'favorites') {
				setIsLoadingFavs(true)
				try {
					const userId = (session.user as any).id
					const response = await fetch(`http://localhost:3333/favorites/user/${userId}`)

					if (response.ok) {
						const data = await response.json()
						setFavorites(data)
					}
				} catch (error) {
					console.error('Erro ao carregar favoritos:', error)
				} finally {
					setIsLoadingFavs(false)
				}
			}
		}

		fetchFavorites()
	}, [session, activeTab])

	// --- FUNÇÃO DO AVATAR ---
	const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const userId = (session?.user as any)?.id
		if (!userId) return alert('Erro: ID não encontrado.')

		try {
			setIsUploadingAvatar(true)
			const formData = new FormData()
			formData.append('avatar', file)

			const response = await fetch(`http://localhost:3333/users/${userId}/avatar`, {
				method: 'PATCH',
				body: formData,
			})

			if (!response.ok) throw new Error('Falha ao enviar a imagem')

			const updatedUser = await response.json()
			await update({ image: updatedUser.image })
		} catch (error) {
			console.error(error)
			alert('Erro ao atualizar a foto de perfil.')
		} finally {
			setIsUploadingAvatar(false)
		}
	}

	// --- 🔥 NOVA FUNÇÃO DO BANNER ---
	const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const userId = (session?.user as any)?.id
		if (!userId) return alert('Erro: ID não encontrado.')

		try {
			setIsUploadingBanner(true)
			const formData = new FormData()
			formData.append('banner', file) // 'banner' para bater com o multer do backend

			const response = await fetch(`http://localhost:3333/users/${userId}/banner`, {
				method: 'PATCH',
				body: formData,
			})

			if (!response.ok) throw new Error('Falha ao enviar o banner')

			const updatedUser = await response.json()

			// Avisa o NextAuth para atualizar o bannerUrl na sessão!
			await update({ bannerUrl: updatedUser.bannerUrl })
		} catch (error) {
			console.error(error)
			alert('Erro ao atualizar o banner.')
		} finally {
			setIsUploadingBanner(false)
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

	// Pegamos o bannerUrl da sessão (ou usamos o placeholder se não tiver)
	const userBanner =
		(session.user as any).bannerUrl || 'https://placehold.co/1920x400/1a1a1a/333333.png?text=+'

	return (
		<div className="min-h-screen bg-background text-foreground pb-20">
			{/* 🔥 BOTÃO DE VOLTAR FLUTUANTE */}
			<div className="absolute top-6 left-6 sm:left-10 z-30">
				<Link href="/">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full bg-black/40 border-white/20 text-white hover:bg-black/70 backdrop-blur-md transition-all hover:scale-105"
					>
						<ArrowLeft className="w-5 h-5" />
					</Button>
				</Link>
			</div>
			{/* 🔥 HEADER DO PERFIL (Agora é clicável para mudar o Banner!) */}
			<div className="relative h-64 bg-muted overflow-hidden group">
				<div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-purple-900/80 z-0" />
				<Image
					src={userBanner}
					alt="Banner"
					className="w-full h-full object-cover mix-blend-overlay opacity-50 relative z-0 transition-transform duration-700 group-hover:scale-105"
					loading="eager"
					fill
					unoptimized={true}
				/>

				{/* Camada escura que aparece ao passar o rato no banner */}
				<label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10">
					{isUploadingBanner ? (
						<Loader2 className="w-10 h-10 text-white animate-spin" />
					) : (
						<>
							<Camera className="w-10 h-10 text-white mb-2 drop-shadow-md" />
							<span className="text-white text-sm font-bold drop-shadow-md">
								Alterar Banner
							</span>
						</>
					)}
					<input
						type="file"
						className="hidden"
						accept="image/*"
						onChange={handleBannerUpload}
						disabled={isUploadingBanner}
					/>
				</label>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
				<div className="flex flex-col md:flex-row gap-8">
					{/* SIDEBAR */}
					<div className="w-full md:w-80 shrink-0">
						<div className="bg-card border border-border rounded-xl p-6 shadow-2xl backdrop-blur-sm">
							{/* ÁREA DO AVATAR */}
							<div className="relative w-32 h-32 mx-auto -mt-16 mb-4 group">
								<Image
									src={
										session.user.image ||
										'https://placehold.co/200x200/1a1a1a/white.png?text=U'
									}
									alt="Avatar"
									className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg bg-card"
									referrerPolicy="no-referrer"
									loading="eager"
									fill
									unoptimized={true}
								/>

								<label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
									{isUploadingAvatar ? (
										<Loader2 className="w-8 h-8 text-white animate-spin" />
									) : (
										<>
											<Camera className="w-8 h-8 text-white mb-1" />
											<span className="text-white text-xs font-bold">
												Mudar
											</span>
										</>
									)}
									<input
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleAvatarUpload}
										disabled={isUploadingAvatar}
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
						{/* ABA: FAVORITOS */}
						{activeTab === 'favorites' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minha Biblioteca
								</h2>

								{isLoadingFavs ? (
									<div className="flex justify-center py-20">
										<Loader2 className="w-10 h-10 text-primary animate-spin" />
									</div>
								) : favorites.length > 0 ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
										{favorites.map((fav) => {
											// Substitui a linha antiga por esta:
											const coverUrl = fav.coverUrl
												? fav.coverUrl.startsWith('http')
													? fav.coverUrl
													: `http://localhost:3333${fav.coverUrl}`
												: 'https://placehold.co/400x600/1a1a1a/444.png?text=Sem+Capa'

											return (
												<Link
													href={`/manga/${fav.mangaId}`}
													key={fav.favoriteId}
												>
													<div className="group relative rounded-lg overflow-hidden border border-border bg-card aspect-[2/3] cursor-pointer shadow-lg hover:shadow-primary/20 transition-all">
														<img
															src={coverUrl}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
															alt={fav.title}
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-90 group-hover:opacity-100 transition-opacity">
															<h3 className="text-white font-bold truncate leading-tight mb-1">
																{fav.title}
															</h3>
															<p className="text-primary text-[10px] font-bold uppercase tracking-wider">
																Salvo em{' '}
																{new Date(
																	fav.savedAt
																).toLocaleDateString('pt-BR')}
															</p>
														</div>
													</div>
												</Link>
											)
										})}
									</div>
								) : (
									<div className="col-span-full text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
										<Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
										<p className="text-lg font-bold text-foreground">
											A sua biblioteca está vazia.
										</p>
										<p className="text-sm mt-1">
											Encontre mangás incríveis e adicione-os aos favoritos!
										</p>
										<Link href="/">
											<Button className="mt-6 font-bold" variant="outline">
												Explorar Catálogo
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minhas Avaliações
								</h2>
								<div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
									<Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
									<p>Ainda não avaliou nenhum mangá.</p>
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
