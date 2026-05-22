'use client'

import React, { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, BookOpen, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import Header from '../../../components/Header'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
	params: Promise<{ id: string }>
}

export default function PerfilObraPage({ params }: PageProps) {
	const resolvedParams = use(params)
	const mangaId = resolvedParams.id

	const { data: session, status } = useSession()
	const router = useRouter()

	const [manga, setManga] = useState<any>(null)
	const [allChapters, setAllChapters] = useState<any[]>([])
	const [favChapters, setFavChapters] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Carrega todas as informações necessárias do utilizador e da obra
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
			return
		}

		const loadData = async () => {
			if (!session?.user) return
			setIsLoading(true)

			try {
				const userId = (session.user as any).id

				// 1. Busca os detalhes do mangá
				const mangaRes = await fetch(`http://localhost:3333/mangas/${mangaId}`)
				const mangaData = mangaRes.ok ? await mangaRes.json() : null

				// 2. Busca todos os capítulos lançados (para sabermos qual é o último)
				const chaptersRes = await fetch(`http://localhost:3333/chapters/manga/${mangaId}`)
				const chaptersData = chaptersRes.ok ? await chaptersRes.json() : []

				// 3. Busca todos os capítulos favoritados pelo utilizador
				const favChaptersRes = await fetch(
					`http://localhost:3333/favorite-chapters/user/${userId}`
				)
				const favChaptersData = favChaptersRes.ok ? await favChaptersRes.json() : []

				setManga(mangaData)
				setAllChapters(chaptersData)

				// Filtra os capítulos favoritados para manter apenas os DESTE mangá específico
				const filteredFavs = favChaptersData.filter(
					(ch: any) => String(ch.mangaId) === String(mangaId)
				)
				setFavChapters(filteredFavs)
			} catch (error) {
				console.error('Erro ao carregar dados da biblioteca:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (status === 'authenticated') {
			loadData()
		}
	}, [session, status, mangaId, router])

	// Remove um capítulo específico dos favoritos
	const handleRemoveChapterFavorite = async (chapterId: number) => {
		if (!session?.user) return
		const userId = (session.user as any).id

		try {
			const response = await fetch(
				`http://localhost:3333/favorite-chapters/${userId}/${chapterId}`,
				{
					method: 'DELETE',
				}
			)

			if (response.ok) {
				// Atualiza o estado local para remover o card imediatamente da tela
				setFavChapters((prev) => prev.filter((ch) => ch.chapterId !== chapterId))
			} else {
				alert('Não foi possível remover o capítulo dos favoritos.')
			}
		} catch (error) {
			console.error(error)
			alert('Erro ao comunicar com o servidor.')
		}
	}

	if (status === 'loading' || isLoading) {
		return (
			<div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-primary animate-spin" />
			</div>
		)
	}

	if (!manga) {
		return (
			<div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
				<h1 className="text-xl font-bold">Obra não encontrada na sua biblioteca.</h1>
				<Link href="/perfil">
					<Button>Voltar ao Perfil</Button>
				</Link>
			</div>
		)
	}

	// Identifica o último capítulo lançado com base no número mais alto
	const latestChapter =
		allChapters.length > 0
			? [...allChapters].sort((a, b) => b.chapterNumber - a.chapterNumber)[0]
			: null

	// Agrupa os capítulos favoritados por volume para exibição estruturada
	const groupedFavVolumes = Array.from(new Set(favChapters.map((ch) => ch.volumeId))).map(
		(volId) => {
			const volChapters = favChapters.filter((ch) => ch.volumeId === volId)
			return {
				volumeId: volId,
				volumeCover: volChapters[0]?.volumeCover,
				mangaTitle: volChapters[0]?.mangaTitle,
				chapters: volChapters.sort((a, b) => a.chapterNumber - b.chapterNumber),
			}
		}
	)

	const coverUrl = manga.coverUrl?.startsWith('http')
		? manga.coverUrl
		: `http://localhost:3333${manga.coverUrl}`
	const bannerUrl = manga.bannerUrl?.startsWith('http')
		? manga.bannerUrl
		: `http://localhost:3333${manga.bannerUrl}`

	return (
		<div className="dark min-h-screen bg-background text-foreground font-sans pb-20 relative">
			<Header />

			{/* BOTÃO DE VOLTAR FIXO PARA O PERFIL */}
			<div className="absolute top-24 left-6 sm:left-10 z-30">
				<Link href="/perfil">
					<Button
						variant="outline"
						size="icon"
						className="rounded-full bg-black/40 border-white/20 text-white hover:bg-black/70 backdrop-blur-md transition-all"
					>
						<ArrowLeft className="w-5 h-5" />
					</Button>
				</Link>
			</div>

			{/* BANNER IMERSIVO DE FUNDO */}
			<section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
				<Image
					src={
						bannerUrl ||
						'https://placehold.co/1920x800/1a1a1a/white.png?text=Sem+Banner'
					}
					alt={manga.title}
					fill
					className="object-cover opacity-40 blur-[1px]"
					unoptimized={true}
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
			</section>

			{/* PAINEL DE CONTROLO DO LEITOR */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-32 md:-mt-48">
				<div className="bg-card/90 border border-border shadow-2xl backdrop-blur-md rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12">
					{/* CAPA DA OBRA */}
					<div className="flex-shrink-0 w-full md:w-[220px] flex flex-col gap-4 mx-auto md:mx-0">
						<div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-xl border border-border bg-muted">
							<img
								src={
									coverUrl ||
									'https://placehold.co/300x400/1a1a1a/white.png?text=Sem+Capa'
								}
								alt={manga.title}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* BOTÃO DINÂMICO: LER ÚLTIMO CAPÍTULO */}
						{latestChapter ? (
							<Link
								href={`/mangas/${mangaId}/read/${latestChapter.id}`}
								className="w-full"
							>
								<Button className="w-full font-bold bg-primary hover:bg-brand-dark gap-2 text-white h-11">
									<BookOpen className="w-4 h-4" />
									Ler Cap. {latestChapter.chapterNumber}
								</Button>
							</Link>
						) : (
							<Button disabled className="w-full font-bold h-11">
								Nenhum capítulo disponível
							</Button>
						)}
					</div>

					{/* DETALHES DE ACOMPANHAMENTO */}
					<div className="flex-1 flex flex-col justify-between">
						<div>
							<div className="flex justify-between items-start gap-4 mb-4">
								<h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
									{manga.title}
								</h1>
							</div>

							<p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-4 mb-6">
								{manga.synopsis || 'Nenhuma sinopse disponível para esta obra.'}
							</p>
						</div>

						<div className="border-t border-border/60 pt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
							<div>
								Status na Biblioteca:{' '}
								<span className="text-primary font-bold uppercase ml-1">
									A acompanhar
								</span>
							</div>
							<div>
								Capítulos Salvos:{' '}
								<span className="text-white font-bold ml-1">
									{favChapters.length}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* SECÇÃO DE CAPÍTULOS MARCADOS */}
				<div className="mt-8 bg-card border border-border shadow-xl rounded-xl p-6 md:p-8">
					<h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
						<Star className="w-5 h-5 fill-primary text-primary" />
						As Minhas Marcações de Páginas
					</h2>

					{groupedFavVolumes.length > 0 ? (
						<div className="space-y-8">
							{groupedFavVolumes.map((vol) => {
								const volCoverUrl = vol.volumeCover?.startsWith('http')
									? vol.volumeCover
									: `http://localhost:3333${vol.volumeCover}`

								return (
									<div
										key={vol.volumeId}
										className="flex flex-col sm:flex-row gap-6 border-b border-border/40 pb-6 last:border-0 last:pb-0"
									>
										{/* CAPA DO VOLUME */}
										<div className="w-24 aspect-[2/3] rounded-md overflow-hidden border border-border/80 bg-muted shrink-0 mx-auto sm:mx-0 shadow-md">
											<img
												src={
													volCoverUrl ||
													'https://placehold.co/200x300/1a1a1a/444.png?text=Vol'
												}
												alt="Volume Cover"
												className="w-full h-full object-cover"
											/>
										</div>

										{/* LISTA DE CAPÍTULOS DESTE VOLUME */}
										<div className="flex-1 space-y-2">
											<h3 className="text-md font-bold text-muted-foreground mb-3 text-center sm:text-left">
												Capítulos Guardados
											</h3>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{vol.chapters.map((ch) => (
													<div
														key={ch.favoriteId}
														className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/60 hover:border-primary/40 transition-all group"
													>
														<Link
															href={`/mangas/${mangaId}/read/${ch.chapterId}`}
															className="flex-1 flex items-center gap-3"
														>
															<span className="font-bold text-primary min-w-[50px]">
																Cap.{' '}
																{String(ch.chapterNumber).padStart(
																	2,
																	'0'
																)}
															</span>
															<span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
																{ch.chapterTitle || 'Sem título'}
															</span>
														</Link>

														{/* BOTÃO PARA REMOVER MARCAÇÃO */}
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																handleRemoveChapterFavorite(
																	ch.chapterId
																)
															}
															className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-md shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												))}
											</div>
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<div className="text-center py-12 text-muted-foreground bg-muted/10 border border-dashed border-border rounded-lg">
							<BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
							<p className="font-semibold text-foreground">
								Nenhum capítulo marcado neste mangá.
							</p>
							<p className="text-sm mt-1">
								Sempre que gostar de um capítulo ou quiser guardar onde parou,
								marque-o com uma estrela!
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}
