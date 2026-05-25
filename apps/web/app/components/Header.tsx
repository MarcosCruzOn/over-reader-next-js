'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Search, Bookmark, Menu, X, ChevronDown, Bell, Heart, MessageSquare } from 'lucide-react'
import { io } from 'socket.io-client' // 🔥 Importação do Socket Client

import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@workspace/ui/components/dropdown-menu'

export default function Header() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	// Estados do Dropdown de Favoritos
	const [recentFavorites, setRecentFavorites] = useState<any[]>([])
	const [totalFavorites, setTotalFavorites] = useState(0)

	// 🔥 ESTADOS PARA NOTIFICAÇÕES EM TEMPO REAL
	const [notificationsList, setNotificationsList] = useState<any[]>([])
	const [unreadCount, setUnreadCount] = useState(0)

	// Carrega dados iniciais via HTTP
	useEffect(() => {
		if (session?.user) {
			const userId = (session.user as any).id

			// 1. Busca Favoritos
			fetch(`http://localhost:3333/favorites/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					setTotalFavorites(data.length)
					setRecentFavorites(data.slice(0, 4))
				})
				.catch(console.error)

			// 2. Busca Notificações
			fetch(`http://localhost:3333/notifications/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					setNotificationsList(data)
					setUnreadCount(data.filter((n: any) => !n.isRead).length)
				})
				.catch(console.error)
		}
	}, [session])

	// 🔥 CONEXÃO VIA WEBSOCKETS (SALA DE ESCUTA EM TEMPO REAL)
	useEffect(() => {
		if (!session?.user) return

		const userId = (session.user as any).id
		const socket = io('http://localhost:3333')

		// Regista o ID na tabela de canais do servidor
		socket.emit('register', userId)

		// Ouve a chegada de uma nova notificação
		socket.on('notification', (newNotif) => {
			setNotificationsList((prev) => [newNotif, ...prev])
			setUnreadCount((prev) => prev + 1)
		})

		return () => {
			socket.disconnect()
		}
	}, [session])

	// Limpa o marcador de não lidas quando abre o menu
	const handleOpenNotifications = () => {
		if (unreadCount === 0 || !session?.user) return
		const userId = (session.user as any).id

		setUnreadCount(0)
		fetch(`http://localhost:3333/notifications/user/${userId}/read`, {
			method: 'PATCH',
		}).catch(console.error)
	}

	const categories = [
		'Ação',
		'Aventura',
		'Comédia',
		'Drama',
		'Fantasia',
		'Romance',
		'Sci-Fi',
		'Slice of Life',
		'Terror',
		'Mistério',
	]

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			router.push(`/mangas?q=${encodeURIComponent(searchTerm)}`)
			setSearchTerm('')
		}
	}

	return (
		<header className="sticky top-0 z-50 bg-brand-primary text-white shadow-lg h-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
				<div className="flex items-center justify-between h-full">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<div className="text-2xl font-bold tracking-tight">
							OVER<span className="font-light">READER</span>
						</div>
					</Link>

					{/* Navegação Desktop */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-white hover:text-white/80 transition-colors font-medium"
						>
							Home
						</Link>
						<Link
							href="/new-releases"
							className="text-white hover:text-white/80 transition-colors font-medium"
						>
							Lançamentos
						</Link>
						<Link
							href="/popular"
							className="text-white hover:text-white/80 transition-colors font-medium"
						>
							Populares
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-white/80 transition-colors font-medium focus:outline-none select-none">
								<span>Navegar</span>
								<ChevronDown className="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-48 bg-gray-950 border border-gray-800 text-gray-100 shadow-xl mt-2">
								<DropdownMenuGroup>
									{categories.map((category) => (
										<DropdownMenuItem
											key={category}
											className="hover:bg-gray-800 focus:bg-gray-800 focus:text-white cursor-pointer transition-colors"
											asChild
										>
											<Link
												href={`/mangas?genre=${category}`}
												className="w-full"
											>
												{category}
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					{/* Busca */}
					<div className="hidden md:flex items-center flex-1 max-w-md mx-8">
						<form onSubmit={handleSearch} className="relative w-full text-gray-900">
							<Input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Buscar mangá..."
								className="w-full bg-black/20 text-white placeholder:text-white/60 border-none pr-10 focus-visible:ring-2 focus-visible:ring-white/50 h-9"
							/>
							<button
								type="submit"
								className="absolute right-3 top-1/2 -translate-y-1/2"
							>
								<Search className="h-4 w-4 text-white/60 hover:text-white transition-colors" />
							</button>
						</form>
					</div>

					{/* Botões de Ação */}
					<div className="hidden md:flex items-center space-x-4">
						{session?.user && (
							<>
								{/* 🔥 NOVO: DROPDOWN DE NOTIFICAÇÕES (SINO EM TEMPO REAL) */}
								<DropdownMenu
									onOpenChange={(open) => open && handleOpenNotifications()}
								>
									<DropdownMenuTrigger className="text-white hover:bg-black/20 transition-colors relative h-9 w-9 flex items-center justify-center rounded-md outline-none shrink-0">
										<Bell className="h-5 w-5" />
										{unreadCount > 0 && (
											<span className="absolute top-1.5 right-1.5 flex h-2 w-2">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
											</span>
										)}
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-[340px] bg-white text-black p-0 border border-gray-200 shadow-2xl mt-4 rounded-xl overflow-hidden z-50"
									>
										<DropdownMenuGroup>
											<DropdownMenuLabel className="p-4 text-sm font-black uppercase text-gray-900 bg-gray-50 tracking-tight">
												Notificações
											</DropdownMenuLabel>
											<DropdownMenuSeparator className="m-0 bg-gray-200" />
											<div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100">
												{notificationsList.length > 0 ? (
													notificationsList.map((notif) => (
														<DropdownMenuItem
															key={notif.id}
															className="p-4 hover:bg-gray-50 flex gap-3 items-start cursor-pointer focus:bg-gray-50 outline-none"
														>
															<img
																src={
																	notif.actor?.image ||
																	'https://placehold.co/80/1a1a1a/white.png?text=U'
																}
																alt="Autor"
																className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200"
															/>
															<div className="flex flex-col min-w-0">
																<p className="text-xs text-gray-800 leading-normal">
																	<span className="font-bold text-gray-900">
																		{notif.actor?.name}
																	</span>{' '}
																	{notif.type === 'LIKE'
																		? 'curtiu o seu comentário'
																		: 'respondeu ao seu comentário'}{' '}
																	no{' '}
																	<span className="font-bold text-brand-primary">
																		Cap.{' '}
																		{
																			notif.chapter
																				?.chapterNumber
																		}
																	</span>
																	.
																</p>
																<span className="text-[9px] font-bold text-gray-400 uppercase mt-1">
																	{new Date(
																		notif.createdAt
																	).toLocaleDateString('pt-BR')}
																</span>
															</div>
															{notif.type === 'LIKE' ? (
																<Heart className="w-4 h-4 text-brand-primary fill-current shrink-0 ml-auto mt-0.5" />
															) : (
																<MessageSquare className="w-4 h-4 text-blue-500 shrink-0 ml-auto mt-0.5" />
															)}
														</DropdownMenuItem>
													))
												) : (
													<div className="p-8 text-center text-sm font-medium text-gray-400 flex flex-col items-center gap-2">
														<Bell className="w-8 h-8 text-gray-200" />
														Nenhuma notificação por aqui.
													</div>
												)}
											</div>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>

								{/* Dropdown de Biblioteca (Bookmark) */}
								<DropdownMenu>
									<DropdownMenuTrigger className="text-white hover:bg-black/20 transition-colors relative h-9 w-9 flex items-center justify-center rounded-md outline-none shrink-0">
										<Bookmark
											className={`h-5 w-5 ${totalFavorites > 0 ? 'fill-current' : ''}`}
										/>
										{totalFavorites > 0 && (
											<span className="absolute top-1.5 right-1.5 flex h-2 w-2">
												<span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
											</span>
										)}
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-[320px] bg-white text-black p-0 border border-gray-200 shadow-2xl mt-4 rounded-xl overflow-hidden z-50"
									>
										<DropdownMenuGroup>
											<div className="flex flex-col">
												{recentFavorites.length > 0 ? (
													recentFavorites.map((fav) => (
														<Link
															href={`/mangas/${fav.mangaId}`}
															key={fav.favoriteId}
															className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors group"
														>
															<div className="w-2 h-2 rounded-full bg-[#C41E3A] shrink-0"></div>
															<div className="w-12 h-16 relative shrink-0 rounded overflow-hidden shadow-sm border border-gray-200">
																<img
																	src={
																		fav.coverUrl?.startsWith(
																			'http'
																		)
																			? fav.coverUrl
																			: `http://localhost:3333${fav.coverUrl}`
																	}
																	alt={fav.title}
																	className="w-full h-full object-cover"
																/>
															</div>
															<div className="flex flex-col flex-1 overflow-hidden">
																<span className="font-bold text-[13px] text-gray-900 truncate uppercase tracking-tight">
																	{fav.title}
																</span>
																<span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
																	Salvo em{' '}
																	{new Date(
																		fav.savedAt
																	).toLocaleDateString('pt-BR')}
																</span>
															</div>
														</Link>
													))
												) : (
													<div className="p-8 text-sm font-medium text-gray-500 text-center">
														Nenhum mangá na biblioteca.
													</div>
												)}
												<Link
													href="/perfil"
													className="block w-full text-center p-4 text-[13px] font-bold text-[#C41E3A] hover:bg-gray-50 transition-colors"
												>
													Ver todos ({totalFavorites})
												</Link>
											</div>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						)}

						{/* Lógica de Login/Perfil */}
						<div className="flex items-center pl-4 border-l border-white/20">
							{status === 'loading' ? (
								<div className="h-9 w-9 rounded-full bg-white/20 animate-pulse"></div>
							) : session?.user ? (
								<div className="flex items-center gap-3">
									<Link
										href="/perfil"
										className="hover:opacity-80 transition-opacity"
									>
										<Image
											src={
												session.user.image ||
												'https://placehold.co/100x100/1a1a1a/white.png?text=U'
											}
											alt="Avatar"
											className="h-9 w-9 rounded-full border border-white/20 object-cover"
											width={36}
											height={36}
											unoptimized
										/>
									</Link>
									<Button
										variant="ghost"
										size="sm"
										className="text-white hover:bg-black/20 hover:text-red-400 transition-colors"
										onClick={() => signOut()}
									>
										Sair
									</Button>
								</div>
							) : (
								<Link href="/login">
									<Button className="bg-white text-brand-primary hover:bg-gray-100 font-bold transition-colors">
										Entrar
									</Button>
								</Link>
							)}
						</div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-white hover:bg-black/20"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>
			</div>
		</header>
	)
}
