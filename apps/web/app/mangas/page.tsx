import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Settings, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
// 🔥 IMPORTAÇÃO DO BOTÃO AQUI (Ajuste o caminho conforme o seu projeto)
import { FavoriteChapterButton } from '@/app/components/FavoriteChapterButton'

async function getChapterData(mangaId: string, chapterNumber: string) {
	try {
		const res = await fetch(
			`http://localhost:3333/chapters/manga/${mangaId}/number/${chapterNumber}`,
			{
				cache: 'no-store',
			}
		)
		if (!res.ok) return null
		return res.json()
	} catch (error) {
		console.error('Erro ao buscar páginas do capítulo:', error)
		return null
	}
}

export default async function MangaReaderPage({
	params,
}: {
	params: Promise<{ id: string; chapterId: string }>
}) {
	const resolvedParams = await params
	const responseData = await getChapterData(resolvedParams.id, resolvedParams.chapterId)

	let pages: string[] = []
	let chapterDbId: number | null = null // Guardará o ID real do BD para usarmos no Favorito

	if (Array.isArray(responseData)) {
		pages = responseData
	} else if (responseData && Array.isArray(responseData.pages)) {
		pages = responseData.pages
		// 🔥 Recuperamos o ID do capítulo vindo do backend
		chapterDbId = responseData.id || null
	}

	if (pages.length === 0) {
		return (
			<div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Ops! Capítulo não encontrado ou sem páginas.
				</h1>
				<Link href={`/mangas/${resolvedParams.id}`}>
					<Button className="bg-primary hover:bg-brand-dark text-white font-bold px-8 h-12">
						<ChevronLeft className="h-4 w-4 mr-2" /> Voltar para a obra
					</Button>
				</Link>
			</div>
		)
	}

	const currentChapter = parseInt(resolvedParams.chapterId)
	const prevChapter = currentChapter > 1 ? currentChapter - 1 : null
	const nextChapter = currentChapter + 1

	return (
		<div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white pb-24">
			{/* 🧭 NAVBAR MINIMALISTA */}
			<header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between transition-transform duration-300">
				<div className="flex items-center gap-4">
					<Link href={`/mangas/${resolvedParams.id}`}>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white hover:bg-white/10"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
					</Link>
					<div className="flex flex-col">
						<span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
							Lendo agora
						</span>
						<h1 className="font-bold text-sm md:text-base line-clamp-1">
							Capítulo {resolvedParams.chapterId}
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-1 sm:gap-2">
					{/* 🔥 BOTÃO DE FAVORITO EM FORMATO DE ÍCONE NA NAVBAR */}
					{chapterDbId && (
						<FavoriteChapterButton chapterId={chapterDbId} variant="icon" />
					)}
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-white/10"
					>
						<List className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-400 hover:text-white hover:bg-white/10 hidden sm:inline-flex"
					>
						<Settings className="h-5 w-5" />
					</Button>
				</div>
			</header>

			{/* 📖 MOTOR DE LEITURA (Scroll Vertical) */}
			<main className="max-w-3xl mx-auto flex flex-col items-center bg-black min-h-screen">
				{pages.map((pageUrl: string, index: number) => (
					<div key={index} className="w-full flex justify-center">
						<img
							src={pageUrl}
							alt={`Página ${index + 1}`}
							className="w-full h-auto object-contain block"
							loading={index < 3 ? 'eager' : 'lazy'}
						/>
					</div>
				))}
			</main>

			{/* 🔥 MEGA BOTÃO DE FAVORITO NO FINAL DO CAPÍTULO (Logo antes de ir pro próximo) */}
			{chapterDbId && (
				<div className="max-w-3xl mx-auto flex justify-center py-12 px-4 border-t border-white/5 mt-4">
					<div className="text-center flex flex-col items-center gap-4">
						<p className="text-gray-400 text-sm font-medium">
							Gostou deste capítulo ou quer marcar de onde parou?
						</p>
						<FavoriteChapterButton chapterId={chapterDbId} variant="full" />
					</div>
				</div>
			)}

			{/* 🚀 NAVBAR INFERIOR (Navegação de Capítulos) */}
			<footer className="fixed bottom-0 w-full bg-[#050505]/95 backdrop-blur-md border-t border-white/5 p-4 z-50">
				<div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
					{prevChapter ? (
						<Link
							href={`/mangas/${resolvedParams.id}/read/${prevChapter}`}
							className="flex-1"
						>
							<Button
								variant="outline"
								className="w-full bg-transparent border-white/10 text-white hover:bg-white/10 h-12"
							>
								<ChevronLeft className="h-4 w-4 mr-2" /> Capítulo Anterior
							</Button>
						</Link>
					) : (
						<Button
							disabled
							variant="outline"
							className="flex-1 bg-transparent border-white/5 text-white/30 h-12"
						>
							<ChevronLeft className="h-4 w-4 mr-2" /> Capítulo Anterior
						</Button>
					)}

					<Link
						href={`/mangas/${resolvedParams.id}/read/${nextChapter}`}
						className="flex-1"
					>
						<Button className="w-full bg-primary hover:bg-brand-dark text-white font-bold h-12">
							Próximo Capítulo <ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</Link>
				</div>
			</footer>
		</div>
	)
}
