'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	// Traduzi as categorias para combinar com o resto do nosso site em português
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

	// Função que roda quando dá ENTER na busca
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			router.push(`/mangas?q=${encodeURIComponent(searchTerm)}`)
			setSearchTerm('') // Limpa a barra depois de buscar
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

						{/* Shadcn DropdownMenu */}
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-white/80 transition-colors font-medium focus:outline-none">
								<span>Navegar</span>
								<ChevronDown className="h-4 w-4" />
							</DropdownMenuTrigger>
							{/* Ajustamos o fundo do menu para dark (bg-gray-950) e a borda para não ficar branco */}
							<DropdownMenuContent className="w-48 bg-gray-950 border border-gray-800 text-gray-100 shadow-xl mt-2">
								{categories.map((category) => (
									<DropdownMenuItem
										key={category}
										// Ajustamos o hover do shadcn para ficar elegante no dark mode
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

					{/* Barra de Busca com Shadcn Input */}
					<div className="hidden md:flex items-center flex-1 max-w-md mx-8">
						<form onSubmit={handleSearch} className="relative w-full text-gray-900">
							<Input
								type="text"
								value={searchTerm} // LIGA O VALOR
								onChange={(e) => setSearchTerm(e.target.value)} // ATUALIZA O VALOR
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

					{/* Ícones com Shadcn Button */}
					<div className="hidden md:flex items-center space-x-2">
						<Button
							variant="ghost"
							size="icon"
							className="text-white hover:bg-black/20 hover:text-white transition-colors"
						>
							<Bookmark className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="text-white hover:bg-black/20 hover:text-white transition-colors"
						>
							<User className="h-5 w-5" />
						</Button>
					</div>

					{/* Botão Menu Mobile */}
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
