import React from 'react'
import Link from 'next/link'
import Image from 'next/link' // Ajuste caso prefira usar o 'next/image'
import { BookOpen, Search } from 'lucide-react'
import { Input } from '@workspace/ui/components/input'

// 🔥 Importando a central conectada à nuvem!
import { api } from '@/app/lib/api'

export default async function MangasPage() {
	// Puxando os mangás diretamente da nossa API na AWS
	let mangas = []
	try {
		mangas = await api.getMangas()
	} catch (error) {
		console.error('Erro ao buscar a lista de mangás:', error)
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-primary selection:text-white">
			<div className="max-w-7xl mx-auto space-y-10">
				{/* 🏷️ CABEÇALHO DO CATÁLOGO */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
							<BookOpen className="h-8 w-8 text-primary" />
							Catálogo de Obras
						</h1>
						<p className="text-muted-foreground mt-2 font-medium">
							Explore nossa coleção completa e encontre a sua próxima leitura.
						</p>
					</div>

					{/* Barra de Pesquisa */}
					<div className="relative w-full md:w-80">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar mangá..."
							className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary transition-colors"
						/>
					</div>
				</div>

				{/* 📚 GRID DE MANGÁS */}
				{mangas.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
						<BookOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
						<h2 className="text-2xl font-bold uppercase tracking-tight">
							Nenhum mangá encontrado
						</h2>
						<p className="text-muted-foreground mt-2">
							O catálogo está vazio ou ocorreu um erro de conexão com o servidor.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
						{mangas.map((manga: any) => (
							<Link
								href={`/mangas/${manga.id}`}
								key={manga.id}
								className="group flex flex-col gap-3"
							>
								{/* Capa do Mangá */}
								<div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(var(--primary),0.15)]">
									<img
										src={
											manga.coverUrl ||
											'https://via.placeholder.com/300x450?text=Sem+Capa'
										}
										alt={`Capa do mangá ${manga.title}`}
										className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										loading="lazy"
									/>

									{/* Badge de Status */}
									{manga.status && (
										<div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white shadow-xl">
											{manga.status}
										</div>
									)}
								</div>

								{/* Informações */}
								<div>
									<h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
										{manga.title}
									</h3>
									<p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-medium">
										{manga.author || 'Autor Desconhecido'}
									</p>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
