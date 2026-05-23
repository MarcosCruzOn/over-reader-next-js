import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ReaderClient } from './ReaderClient' // 🔥 Importamos o motor interativo!

async function getChapterData(mangaId: string, chapterNumber: string) {
	try {
		const res = await fetch(
			`http://localhost:3333/chapters/manga/${mangaId}/number/${chapterNumber}`,
			{ cache: 'no-store' }
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

	if (Array.isArray(responseData)) {
		pages = responseData
	} else if (responseData && Array.isArray(responseData.pages)) {
		pages = responseData.pages
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

	// Renderiza o nosso Motor de Leitura!
	return (
		<ReaderClient
			mangaId={resolvedParams.id}
			chapterId={resolvedParams.chapterId}
			pages={pages}
			prevChapter={prevChapter}
			nextChapter={nextChapter}
		/>
	)
}
