import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import MangaTabsSection from '@/app/components/MangaTabsSection'
import { FavoriteButton } from '@/app/components/FavoriteButton'
import { Bookmark, Star } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Manga } from '@workspace/types'

// ⚡ Server Action: Busca o mangá específico pelo ID
async function getManga(id: string): Promise<Manga | null> {
	try {
		const res = await fetch(`http://localhost:3333/mangas/${id}`, {
			cache: 'no-store',
		})
		if (!res.ok) return null
		return res.json()
	} catch (error) {
		console.error('Erro ao buscar o mangá:', error)
		return null
	}
}

// ⚡ Nova função para buscar os capítulos reais
async function getMangaChapters(mangaId: string) {
	try {
		const res = await fetch(`http://localhost:3333/chapters/manga/${mangaId}`, {
			cache: 'no-store',
		})
		if (!res.ok) return []
		return res.json()
	} catch (error) {
		console.error('Erro ao buscar capítulos:', error)
		return []
	}
}

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params
	const manga = await getManga(resolvedParams.id)

	// 🔥 BUSCA OS CAPÍTULOS REAIS AQUI
	const chapters = await getMangaChapters(resolvedParams.id)

	// 🔥 LÓGICA DE AGRUPAMENTO AVANÇADA (No Servidor)
	const groupedVolumes = Array.from(new Set(chapters.map((ch: any) => ch.volumeNumber)))
		.sort((a: any, b: any) => b - a)
		.map((volNum) => {
			const volChapters = chapters.filter((ch: any) => ch.volumeNumber === volNum)
			const latestDate = volChapters.length > 0 ? volChapters[0].createdAt : null

			// 🔥 Pegamos a capa específica deste volume (que veio do primeiro capítulo dele)
			const volCover = volChapters.length > 0 ? volChapters[0].volumeCover : null

			return {
				number: volNum,
				coverUrl: volCover, // Guardamos a capa do volume aqui!
				chapters: volChapters,
				latestDate: latestDate,
			}
		})

	if (!manga) {
		return (
			<div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
				<Header />
				<h1 className="text-2xl font-bold mt-20">Mangá não encontrado.</h1>
				<Link href="/" className="text-primary hover:underline mt-4">
					Voltar para a Home
				</Link>
			</div>
		)
	}

	const coverUrl = manga.coverUrl || 'https://placehold.co/300x400/1a1a1a/white.png?text=Sem+Capa'
	const bannerUrl =
		manga.bannerUrl || 'https://placehold.co/1920x800/1a1a1a/white.png?text=Sem+Banner'

	return (
		<div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground pb-20">
			<Header />

			{/* 🎆 HERO SECTION (Banner de Fundo) */}
			<section className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
				<Image
					src={bannerUrl}
					alt={`Banner de ${manga.title}`}
					fill
					className="object-cover opacity-60 blur-[2px]"
					unoptimized={bannerUrl.includes('localhost')}
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
			</section>

			{/* 📚 MANGA DETAIL CARD (Sobrepondo o Banner) */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-40 md:-mt-64">
				<div className="bg-card border border-border shadow-2xl rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12">
					{/* Lado Esquerdo: Capa e Botão */}
					<div className="flex-shrink-0 w-full md:w-[260px] flex flex-col gap-6">
						<div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg border border-border">
							<Image
								src={coverUrl}
								alt={`Capa de ${manga.title}`}
								fill
								sizes="(max-width: 768px) 100vw, 260px"
								className="object-cover"
								unoptimized={coverUrl.includes('localhost')}
								loading="lazy"
							/>
						</div>
						<Link href={`/mangas/${resolvedParams.id}/read/1`} className="w-full block">
							<Button
								size="lg"
								className="w-full text-md font-bold h-12 bg-primary hover:bg-brand-dark text-white"
							>
								Começar a ler Vol. 1
							</Button>
						</Link>
					</div>

					{/* Lado Direito: Informações */}
					<div className="flex-1 flex flex-col">
						{/* 🔥 AQUI FOI AJUSTADO O ALINHAMENTO */}
						<div className="flex justify-between items-center mb-6 gap-4">
							<h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
								{manga.title}
							</h1>

							{/* 🔥 O NOSSO NOVO BOTÃO ENTRA AQUI! */}
							<div className="shrink-0">
								<FavoriteButton mangaId={manga.id} />
							</div>
						</div>

						{/* Tabela de Metadados */}
						<div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm md:text-base mb-8">
							<span className="text-muted-foreground font-medium">Gênero:</span>
							<span className="text-primary font-medium">
								{manga.genres
									? Array.isArray(manga.genres)
										? manga.genres.join(', ')
										: manga.genres
									: 'Não informado'}
							</span>

							<span className="text-muted-foreground font-medium">Artista:</span>
							<span className="text-primary font-medium">
								{manga.author || 'Desconhecido'}
							</span>

							<span className="text-muted-foreground font-medium">Atualização:</span>
							<span className="text-foreground">
								VOL. {groupedVolumes.length > 0 ? groupedVolumes[0].number : 1}
							</span>

							<span className="text-muted-foreground font-medium">Avaliação:</span>
							<div className="flex items-center gap-1">
								<div className="flex text-yellow-500">
									<Star className="h-4 w-4 fill-current" />
									<Star className="h-4 w-4 fill-current" />
									<Star className="h-4 w-4 fill-current" />
									<Star className="h-4 w-4 fill-current" />
									<Star className="h-4 w-4 fill-current opacity-50" />
								</div>
								<span className="text-primary font-bold ml-2">(4.5)</span>
							</div>
						</div>

						{/* Sinopse */}
						<div className="text-muted-foreground leading-relaxed text-sm md:text-base">
							<p className="line-clamp-4">
								{manga.synopsis || 'Nenhuma sinopse disponível para esta obra.'}
							</p>
							<button className="text-primary font-semibold mt-2 hover:underline">
								Ler mais
							</button>
						</div>
					</div>
				</div>

				{/* 📑 LIST SECTION (Volumes / Capítulos / Galeria) */}
				<div className="mt-8 bg-card border border-border shadow-xl rounded-xl p-6">
					<MangaTabsSection
						manga={manga}
						chapters={chapters}
						groupedVolumes={groupedVolumes}
					/>
				</div>
			</main>
		</div>
	)
}
