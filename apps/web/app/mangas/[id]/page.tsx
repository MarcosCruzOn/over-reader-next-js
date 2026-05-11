import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import { Bookmark, Star, LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@workspace/ui/components/tabs'
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

	const uniqueVolumes = Array.from(new Set(chapters.map((ch: any) => ch.volumeNumber))).sort(
		(a: any, b: any) => b - a
	) // Ordena do último volume para o primeiro

	const groupedVolumes = Array.from(new Set(chapters.map((ch: any) => ch.volumeNumber)))
		.sort((a: any, b: any) => b - a) // Ordena do volume mais novo para o mais velho
		.map((volNum) => {
			// Filtra todos os capítulos deste volume
			const volChapters = chapters.filter((ch: any) => ch.volumeNumber === volNum)
			// Como a lista global já vem do mais novo pro mais velho (DESC),
			// o índice 0 sempre será o capítulo mais recente deste volume.
			const latestDate = volChapters.length > 0 ? volChapters[0].createdAt : null

			return {
				number: volNum,
				chapters: volChapters,
				latestDate: latestDate,
			}
		})

	{
		/* ... erro ... */
	}
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
					priority
					className="object-cover opacity-60 blur-[2px]"
					unoptimized={bannerUrl.includes('localhost')}
				/>
				{/* Gradiente para fundir o banner com o fundo preto do site */}
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
							/>
							{/* Badge de Volume igual ao seu layout */}
							<div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-white font-black text-xl px-2 py-1 rounded">
								26
							</div>
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
						<div className="flex items-start justify-between mb-6">
							<h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
								{manga.title}
							</h1>
							<Button
								variant="ghost"
								size="icon"
								className="text-primary hover:bg-primary/10 hover:text-primary"
							>
								<Bookmark className="h-8 w-8" />
							</Button>
						</div>

						{/* Tabela de Metadados (A tradução perfeita do seu HTML) */}
						<div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm md:text-base mb-8">
							<span className="text-muted-foreground font-medium">Gênero:</span>
							<span className="text-primary font-medium">
								{/* Verifica se é um array. Se for, usa o join. Se não for (string), apenas exibe o texto! */}
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
							<span className="text-foreground">VOL. 26</span>

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

				{/* 📑 LIST SECTION (Volumes / Capítulos) */}
				<div className="mt-8 bg-card border border-border shadow-xl rounded-xl p-6">
					{/* 📑 LIST SECTION (Volumes / Capítulos) */}
					<Tabs defaultValue="vol" className="w-full">
						{/* Cabeçalho da Lista: Abas e Controles de Grid/List restaurados */}
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 mb-4 gap-4">
							<TabsList className="bg-transparent border-none p-0 gap-6">
								<TabsTrigger
									value="vol"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
								>
									VOL.
								</TabsTrigger>
								<TabsTrigger
									value="ch"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
								>
									CH.
								</TabsTrigger>
								{/* Nova Aba de Galeria */}
								<TabsTrigger
									value="gallery"
									className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
								>
									Galeria
								</TabsTrigger>
							</TabsList>

							{/* Controles de Visualização (Grid/List) restaurados */}
							<div className="flex items-center gap-4 text-muted-foreground">
								<div className="flex items-center gap-2">
									<button
										className="hover:text-primary transition-colors p-1"
										title="Visualização em Grid"
									>
										<LayoutGrid className="h-5 w-5" />
									</button>
									<button
										className="text-primary transition-colors p-1"
										title="Visualização em Lista"
									>
										<ListIcon className="h-6 w-6" />
									</button>
								</div>
								<div className="h-6 w-px bg-border mx-2"></div>
								<select className="bg-transparent border-b border-border text-sm font-medium focus:outline-none text-foreground pb-1 cursor-pointer">
									<option value="latest" className="bg-card">
										Mais Recentes
									</option>
									<option value="oldest" className="bg-card">
										Mais Antigos
									</option>
								</select>
							</div>
						</div>

						{/* 📚 ABA DE VOLUMES (Com Accordion e Data) */}
						<TabsContent value="vol" className="mt-0">
							<div className="flex flex-col gap-3">
								{groupedVolumes.length > 0 ? (
									groupedVolumes.map((vol) => (
										// Usamos a tag <details> nativa do HTML para criar um Accordion sem Javascript extra!
										<details
											key={vol.number}
											className="group border border-border rounded-lg bg-background overflow-hidden transition-all duration-300"
										>
											<summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
												<div className="flex items-center gap-4">
													<span className="font-bold text-foreground text-lg uppercase">
														Volume {vol.number}
													</span>
													<span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
														{vol.chapters.length} Capítulos
													</span>
												</div>
												<div className="flex items-center gap-4">
													<span className="text-xs text-muted-foreground font-medium uppercase hidden sm:block">
														Atualizado em:{' '}
														{vol.latestDate
															? new Date(
																	vol.latestDate
																).toLocaleDateString('pt-BR')
															: 'N/A'}
													</span>
													{/* A setinha gira quando o <details> é aberto */}
													<ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
												</div>
											</summary>

											{/* Lista de Capítulos Dentro do Volume */}
											<div className="border-t border-border bg-card">
												{vol.chapters.map((ch: any, index: number) => (
													<Link
														key={ch.id}
														href={`/mangas/${manga.id}/read/${ch.chapterNumber}`}
														className={`flex items-center justify-between py-3 px-6 hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}`}
													>
														<span className="font-semibold text-foreground text-sm uppercase">
															Cap. {ch.chapterNumber}
															<span className="text-muted-foreground font-normal ml-2 hidden md:inline">
																— {ch.title}
															</span>
														</span>
														<span className="text-xs text-muted-foreground">
															{new Date(
																ch.createdAt
															).toLocaleDateString('pt-BR')}
														</span>
													</Link>
												))}
											</div>
										</details>
									))
								) : (
									<div className="text-center py-12 text-muted-foreground">
										Nenhum volume encontrado.
									</div>
								)}
							</div>
						</TabsContent>

						{/* 📖 ABA DE CAPÍTULOS (Lista Direta) */}
						<TabsContent value="ch" className="mt-0">
							<div className="flex flex-col">
								{chapters.length > 0 ? (
									chapters.map((ch: any, index: number) => (
										<Link
											key={ch.id}
											href={`/mangas/${manga.id}/read/${ch.chapterNumber}`}
											className={`flex items-center justify-between py-4 px-4 hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}`}
										>
											<div className="flex items-center gap-4">
												<div
													className={`h-2 w-2 rounded-full ${new Date(ch.createdAt) > new Date(Date.now() - 172800000) ? 'bg-primary' : 'bg-transparent'}`}
												></div>
												<span className="font-semibold text-foreground uppercase">
													Cap. {ch.chapterNumber}
												</span>
												<span className="text-muted-foreground text-sm font-normal hidden md:inline">
													— {ch.title || 'Sem título'}
												</span>
											</div>
											<span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
												{new Date(ch.createdAt).toLocaleDateString('pt-BR')}
											</span>
										</Link>
									))
								) : (
									<div className="text-center py-12 text-muted-foreground">
										Nenhum capítulo disponível.
									</div>
								)}
							</div>
						</TabsContent>

						{/* 🖼️ ABA DE GALERIA */}
						<TabsContent value="gallery">
							<div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-4">
								<p className="mb-2 text-lg font-medium">
									Galeria de Artes em Breve
								</p>
								<p className="text-sm opacity-60">
									Aqui ficarão as artes oficiais, capas de volumes e ilustrações.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	)
}
