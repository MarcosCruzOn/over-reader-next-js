import React from 'react'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

// Ajuste os caminhos de importação conforme a estrutura da sua pasta web
import Header from '@/app/components/Header'
import MangaGrid from '@/app/components/MangaGrid'
import { Manga } from '@workspace/types'

// ⚡ Função que constrói a URL dinamicamente com base nos filtros
async function getFilteredMangas(query?: string, genre?: string): Promise<Manga[]> {
	try {
		const url = new URL('http://localhost:3333/mangas')

		// Se existir termo de busca, adiciona ?search=...
		if (query) url.searchParams.append('search', query)
		// Se existir gênero, adiciona &genre=...
		if (genre) url.searchParams.append('genre', genre)

		const res = await fetch(url.toString(), { cache: 'no-store' })
		if (!res.ok) return []
		return res.json()
	} catch (error) {
		console.error('Erro ao buscar mangás:', error)
		return []
	}
}

export default async function SearchResultsPage({
	searchParams,
}: {
	// No Next.js 16+, searchParams é uma Promise
	searchParams: Promise<{ q?: string; genre?: string }>
}) {
	const resolvedParams = await searchParams
	const { q, genre } = resolvedParams

	// Dispara a requisição para o backend
	const mangas = await getFilteredMangas(q, genre)

	// 🎨 Lógica para definir um título de página bonito e semântico
	let pageTitle = 'Todos os Mangás'
	if (q && genre) pageTitle = `Resultados para "${q}" em ${genre}`
	else if (q) pageTitle = `Resultados para "${q}"`
	else if (genre) pageTitle = `Explorando: ${genre}`

	return (
		<div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-20">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
				{/* CABEÇALHO DA BUSCA */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-border pb-6">
					<div>
						<h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-foreground">
							{pageTitle}
						</h1>
						<p className="text-muted-foreground mt-2 font-medium">
							{mangas.length}{' '}
							{mangas.length === 1 ? 'obra encontrada' : 'obras encontradas'}
						</p>
					</div>

					{/* Botão de Limpar Filtros só aparece se houver alguma busca ativa */}
					{(q || genre) && (
						<Link href="/mangas">
							<Button
								variant="outline"
								className="border-border bg-transparent text-foreground hover:text-primary hover:border-primary transition-colors"
							>
								Limpar Filtros
							</Button>
						</Link>
					)}
				</div>

				{/* EXIBIÇÃO DOS RESULTADOS OU TELA DE ERRO AMIGÁVEL */}
				{mangas.length > 0 ? (
					<MangaGrid mangas={mangas} />
				) : (
					<div className="flex flex-col items-center justify-center py-32 text-center bg-card border border-border rounded-2xl shadow-sm mt-8">
						<SearchX className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
						<h2 className="text-2xl font-bold text-foreground mb-2">
							Nenhum mangá encontrado
						</h2>
						<p className="text-muted-foreground max-w-md">
							Não conseguimos encontrar nenhuma obra que corresponda aos seus filtros
							atuais. Tente usar termos diferentes, verificar a ortografia ou explorar
							outras categorias.
						</p>
						<Link href="/mangas" className="mt-6">
							<Button className="bg-primary hover:bg-brand-dark text-white font-bold px-8 h-12">
								Ver todo o catálogo
							</Button>
						</Link>
					</div>
				)}
			</main>
		</div>
	)
}
