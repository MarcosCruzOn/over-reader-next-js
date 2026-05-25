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
	Heart,
} from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

import Image from 'next/image'
import Link from 'next/link'

export default function PerfilPage() {
	const { data: session, status, update } = useSession()
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('favorites')

	const [favorites, setFavorites] = useState<any[]>([])
	const [reviews, setReviews] = useState<any[]>([]) // 🔥 Estado para avaliações
	const [isLoadingFavs, setIsLoadingFavs] = useState(false)
	const [isLoadingReviews, setIsLoadingReviews] = useState(false)
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
	const [isUploadingBanner, setIsUploadingBanner] = useState(false)

	const [userComments, setUserComments] = useState<any[]>([])
	const [isLoadingUserComments, setIsLoadingUserComments] = useState(false)

	const [unreadCount, setUnreadCount] = useState(0)

	// 🔄 Busca Favoritos
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

	// 🔄 Busca Avaliações
	useEffect(() => {
		const fetchReviews = async () => {
			if (session?.user && activeTab === 'reviews') {
				setIsLoadingReviews(true)
				try {
					const userId = (session.user as any).id
					const response = await fetch(`http://localhost:3333/reviews/user/${userId}`)
					if (response.ok) {
						const data = await response.json()
						setReviews(data)
					}
				} catch (error) {
					console.error('Erro ao buscar avaliações:', error)
				} finally {
					setIsLoadingReviews(false)
				}
			}
		}
		fetchReviews()
	}, [session, activeTab])

	// 🔄 Busca Comentários do Usuário
	useEffect(() => {
		const fetchUserComments = async () => {
			if (session?.user && activeTab === 'comments') {
				setIsLoadingUserComments(true)
				try {
					const userId = (session.user as any).id
					const response = await fetch(`http://localhost:3333/comments/user/${userId}`)
					if (response.ok) {
						const data = await response.json()
						setUserComments(data)
					}
				} catch (error) {
					console.error('Erro ao buscar comentários do usuário:', error)
				} finally {
					setIsLoadingUserComments(false)
				}
			}
		}
		fetchUserComments()
	}, [session, activeTab])

	// 🔥 🔄 Busca Notificações Não Lidas
	useEffect(() => {
		if (session?.user) {
			const userId = (session.user as any).id
			fetch(`http://localhost:3333/notifications/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					setUnreadCount(data.filter((n: any) => !n.isRead).length)
				})
				.catch(console.error)
		}
	}, [session])

	// --- FUNÇÕES DE UPLOAD (MANTIDAS) ---
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

	const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const userId = (session?.user as any)?.id
		if (!userId) return alert('Erro: ID não encontrado.')

		try {
			setIsUploadingBanner(true)
			const formData = new FormData()
			formData.append('banner', file)
			const response = await fetch(`http://localhost:3333/users/${userId}/banner`, {
				method: 'PATCH',
				body: formData,
			})
			if (!response.ok) throw new Error('Falha ao enviar o banner')
			const updatedUser = await response.json()
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
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		)
	}

	if (!session?.user) return null

	const userBanner =
		(session.user as any).bannerUrl || 'https://placehold.co/1920x400/1a1a1a/333333.png?text=+'

	return (
		<div className="min-h-screen bg-background text-foreground pb-20">
			{/* BOTÃO DE VOLTAR */}
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

			{/* 🔥 HEADER DO PERFIL (GRADIENTE REMOVIDO) */}
			<div className="relative h-[300px] bg-muted overflow-hidden group border-b border-border">
				<Image
					src={userBanner}
					alt="Banner"
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					loading="eager"
					fill
					unoptimized={true}
				/>
				<label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 backdrop-blur-sm">
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

			{/* 🔥 ESTRUTURA DO LAYOUT CORRIGIDA */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
				<div className="flex flex-col md:flex-row gap-8 items-start">
					{/* SIDEBAR (É a única que sobe e sobrepõe o banner agora!) */}
					<div className="w-full md:w-80 shrink-0 -mt-24">
						<div className="bg-card border border-border rounded-xl p-6 shadow-2xl backdrop-blur-sm">
							<div className="relative w-36 h-36 mx-auto -mt-16 mb-4 group">
								{/* Tag img nativa para evitar erros de domínio do Next.js com fotos do Google */}
								<img
									src={
										session.user.image ||
										'https://placehold.co/200x200/1a1a1a/white.png?text=U'
									}
									alt="Avatar"
									className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg bg-card"
									referrerPolicy="no-referrer"
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

							<div className="text-center mb-8">
								<h1 className="text-2xl font-black text-foreground uppercase tracking-tight">
									{session.user.name}
								</h1>
								<p className="text-muted-foreground text-sm mb-3">
									{session.user.email}
								</p>
								<div className="inline-flex items-center px-4 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
									Leitor Nvl. 1
								</div>
							</div>

							<div className="space-y-2">
								<Button
									variant={activeTab === 'favorites' ? 'default' : 'ghost'}
									className="w-full justify-start font-bold"
									onClick={() => setActiveTab('favorites')}
								>
									<Bookmark className="w-5 h-5 mr-3" /> Favoritos
								</Button>
								<Button
									variant={activeTab === 'reviews' ? 'default' : 'ghost'}
									className="w-full justify-start font-bold"
									onClick={() => setActiveTab('reviews')}
								>
									<Star className="w-5 h-5 mr-3" /> Minhas Avaliações
								</Button>
								<Button
									variant={activeTab === 'comments' ? 'default' : 'ghost'}
									className="w-full justify-start font-bold relative"
									onClick={() => {
										setActiveTab('comments')
										// Opcional: Se quiser zerar a bolinha ao clicar na aba, descomente a linha abaixo
										// setUnreadCount(0)
									}}
								>
									<MessageSquare className="w-5 h-5 mr-3" /> Comentários
									{unreadCount > 0 && (
										<span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
											<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-card shadow-sm"></span>
										</span>
									)}
								</Button>
								<div className="my-6 border-t border-border" />
								<Button
									variant={activeTab === 'settings' ? 'default' : 'ghost'}
									className="w-full justify-start font-bold text-muted-foreground"
									onClick={() => setActiveTab('settings')}
								>
									<Settings className="w-5 h-5 mr-3" /> Configurações
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10"
									onClick={() => signOut({ callbackUrl: '/' })}
								>
									<LogOut className="w-5 h-5 mr-3" /> Sair da conta
								</Button>
							</div>
						</div>
					</div>

					{/* ÁREA DE CONTEÚDO (Agora fica naturalmente na direita, abaixo da linha do banner) */}
					<div className="flex-1 mt-8 md:mt-12 w-full pb-12">
						{/* ABA: FAVORITOS */}
						{activeTab === 'favorites' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.6)]"></div>
									<h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">
										Minha Biblioteca
									</h2>
								</div>

								{isLoadingFavs ? (
									<div className="flex justify-center py-20">
										<Loader2 className="w-10 h-10 text-primary animate-spin" />
									</div>
								) : favorites.length > 0 ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
										{favorites.map((fav) => {
											const coverUrl = fav.coverUrl
												? fav.coverUrl.startsWith('http')
													? fav.coverUrl
													: `http://localhost:3333${fav.coverUrl}`
												: 'https://placehold.co/400x600/1a1a1a/444.png?text=Sem+Capa'
											return (
												<Link
													href={`/mangas/${fav.mangaId}`}
													key={fav.favoriteId}
												>
													<div className="group relative rounded-xl overflow-hidden border border-border bg-card aspect-[2/3] cursor-pointer shadow-lg hover:border-primary/50 transition-all">
														<Image
															src={coverUrl}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
															alt={fav.title}
															loading="lazy"
															fill
															unoptimized={true}
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
									<div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
										<Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
										<p className="text-lg font-bold text-foreground">
											A sua biblioteca está vazia.
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

						{/* ABA: AVALIAÇÕES */}
						{activeTab === 'reviews' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-2 h-10 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.6)]"></div>
									<h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">
										Minhas Avaliações
									</h2>
								</div>

								{isLoadingReviews ? (
									<div className="flex justify-center py-20">
										<Loader2 className="w-10 h-10 text-primary animate-spin" />
									</div>
								) : reviews.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{reviews.map((rev) => {
											// Corrige a URL da imagem com o Join que fizemos no backend
											const coverUrl = rev.manga?.coverUrl
												? rev.manga.coverUrl.startsWith('http')
													? rev.manga.coverUrl
													: `http://localhost:3333${rev.manga.coverUrl}`
												: 'https://placehold.co/150x200/1a1a1a/white.png?text=Sem+Capa'

											return (
												<div
													key={rev.id}
													className="bg-card border border-border rounded-xl p-4 flex gap-5 hover:border-yellow-500/40 transition-colors shadow-sm group"
												>
													<div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden shrink-0 border border-border/50">
														<Image
															src={coverUrl}
															alt={rev.manga?.title || 'Mangá'}
															fill
															className="object-cover group-hover:scale-105 transition-transform duration-300"
															unoptimized={true}
														/>
													</div>
													<div className="flex flex-col justify-center py-1">
														<Link
															href={`/mangas/${rev.mangaId}`}
															className="font-black text-lg uppercase tracking-tight hover:text-yellow-500 transition-colors line-clamp-1"
														>
															{rev.manga?.title ||
																`Mangá #${rev.mangaId}`}
														</Link>
														<div className="flex items-center gap-1 mt-2 mb-1 text-yellow-400">
															{Array.from({ length: 5 }).map(
																(_, i) => (
																	<Star
																		key={i}
																		className={`w-4 h-4 ${i < rev.rating ? 'fill-current drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]' : 'text-gray-600'}`}
																	/>
																)
															)}
														</div>
														<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
															{new Date(
																rev.createdAt
															).toLocaleDateString('pt-BR')}
														</p>
													</div>
												</div>
											)
										})}
									</div>
								) : (
									<div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
										<Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
										<p className="text-lg font-bold text-foreground">
											Ainda não avaliou nenhum mangá.
										</p>
										<p className="text-sm mt-1">
											Dê estrelas às suas obras favoritas para vê-las aqui.
										</p>
									</div>
								)}
							</div>
						)}

						{/* ABA: COMENTÁRIOS */}
						{activeTab === 'comments' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-2 h-10 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
									<h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">
										Meus Comentários
									</h2>
								</div>

								{isLoadingUserComments ? (
									<div className="flex justify-center py-20">
										<Loader2 className="w-10 h-10 text-primary animate-spin" />
									</div>
								) : userComments.length > 0 ? (
									<div className="grid grid-cols-1 gap-4">
										{userComments.map((comment) => (
											<div
												key={comment.id}
												className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:border-blue-500/40 transition-colors"
											>
												<div className="flex justify-between items-start">
													<div className="flex flex-col">
														<div>
															<span className="text-xs font-bold text-primary uppercase tracking-wider">
																{comment.manga?.title ||
																	'Obra Desconhecido'}
															</span>
															<span className="text-xs font-bold text-primary uppercase tracking-wider ml-2">
																Capítulo{' '}
																{comment.chapter?.chapterNumber ||
																	'Desconhecido'}
															</span>
														</div>
														<span className="text-xs text-muted-foreground mt-0.5">
															{new Date(
																comment.createdAt
															).toLocaleDateString('pt-BR')}
														</span>
													</div>
													<div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
														<Heart className="w-4 h-4" />{' '}
														{comment.likesCount}
													</div>
												</div>
												<p className="text-sm text-foreground bg-white/5 p-3 rounded-lg border border-white/5">
													{comment.text}
												</p>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/20">
										<MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
										<p className="text-lg font-bold text-foreground">
											Nenhum comentário ainda.
										</p>
										<p className="text-sm mt-1">
											Vá até o leitor e participe da comunidade!
										</p>
									</div>
								)}
							</div>
						)}

						{/* ABA: CONFIGURAÇÕES */}
						{activeTab === 'settings' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
								<div className="flex items-center gap-4 mb-8">
									<div className="w-2 h-10 bg-gray-400 rounded-full"></div>
									<h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-foreground">
										Configurações
									</h2>
								</div>

								<div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
									<div className="space-y-2">
										<label className="text-sm font-black text-muted-foreground uppercase tracking-wider">
											Nome de Exibição
										</label>
										<Input
											defaultValue={session.user.name || ''}
											className="bg-background border-border h-12 font-medium"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-black text-muted-foreground uppercase tracking-wider">
											E-mail (Google)
										</label>
										<Input
											defaultValue={session.user.email || ''}
											disabled
											className="bg-muted/50 cursor-not-allowed text-muted-foreground border-border h-12 font-medium"
										/>
									</div>
									<Button className="font-bold uppercase tracking-wider h-12 px-8">
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
