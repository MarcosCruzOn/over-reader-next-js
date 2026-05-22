'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Search, Bookmark, User, Menu, X, ChevronDown } from 'lucide-react'

// Importando nossos componentes premium do shadcn/ui
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

export default function Header() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	// 🔥 ESTADOS PARA O DROPDOWN DE FAVORITOS
	const [recentFavorites, setRecentFavorites] = useState<any[]>([])
	const [totalFavorites, setTotalFavorites] = useState(0)

	// 🔥 BUSCA OS FAVORITOS ASSIM QUE O USUÁRIO LOGA
	useEffect(() => {
		if (session?.user) {
			const userId = (session.user as any).id
			fetch(`http://localhost:3333/favorites/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					setTotalFavorites(data.length)
					// Pega apenas os 4 primeiros para exibir na caixinha
					setRecentFavorites(data.slice(0, 4))
				})
				.catch(console.error)
		}
	}, [session])

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
		<header className="sticky top-0 z-50 bg-brand-primary text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
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
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-white/80 transition-colors font-medium focus:outline-none">
								<span>Navegar</span>
								<ChevronDown className="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-48 bg-gray-950 border border-gray-800 text-gray-100 shadow-xl mt-2">
								{categories.map((category) => (
									<DropdownMenuItem
										key={category}
										className="hover:bg-gray-800 focus:bg-gray-800 focus:text-white cursor-pointer transition-colors"
									>
										<Link href={`/mangas?genre=${category}`} className="w-full">
											{category}
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					{/* Barra de Busca */}
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

					{/* Ícones e Autenticação */}
					<div className="hidden md:flex items-center space-x-4">
						{/* 🔥 CAIXA DE FAVORITOS (DROPDOWN IDÊNTICO À FOTO) */}
						{session?.user && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="text-white hover:bg-black/20 hover:text-white transition-colors relative outline-none"
									>
										{/* Ícone preenchido se tiver favoritos */}
										<Bookmark
											className={`h-5 w-5 ${totalFavorites > 0 ? 'fill-current' : ''}`}
										/>

										{/* Pontinho vermelho avisando que tem itens */}
										{totalFavorites > 0 && (
											<span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-brand-primary"></span>
											</span>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[320px] bg-white text-black p-0 border border-gray-200 shadow-2xl mt-4 rounded-xl overflow-hidden z-50"
								>
									<div className="flex flex-col">
										{recentFavorites.length > 0 ? (
											recentFavorites.map((fav) => {
												const coverUrl = fav.coverUrl?.startsWith('http')
													? fav.coverUrl
													: `http://localhost:3333${fav.coverUrl}`
												return (
													<Link
														href={`/perfil/obra/${fav.mangaId}`}
														key={fav.favoriteId}
														className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors group"
													>
														{/* Pontinho Vermelho à esquerda */}
														<div className="w-2 h-2 rounded-full bg-[#C41E3A] shrink-0 group-hover:scale-125 transition-transform"></div>

														{/* Capa Miniatura */}
														<div className="w-12 h-16 relative shrink-0 rounded overflow-hidden shadow-sm border border-gray-200">
															<Image
																src={coverUrl}
																alt={fav.title}
																fill
																className="object-cover"
																unoptimized={true}
															/>
														</div>

														{/* Título e Info */}
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
												)
											})
										) : (
											<div className="p-8 text-sm font-medium text-gray-500 text-center flex flex-col items-center gap-2">
												<Bookmark className="w-8 h-8 text-gray-300" />
												Nenhum mangá na biblioteca.
											</div>
										)}
										<Link
											href="/perfil"
											className="block w-full text-center p-4 text-[13px] font-bold text-[#C41E3A] hover:bg-gray-50 transition-colors"
										>
											Ver todos os mangás salvos ({totalFavorites})
										</Link>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
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
											loading="eager"
											width={36}
											height={36}
											unoptimized={true}
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
						className="md:hidden text-white hover:bg-black/20 hover:text-white transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>
			</div>
		</header>
	)
}
