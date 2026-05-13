import React from 'react'
import Header from '@/app/components/Header'
import MangaGrid from '@/app/components/MangaGrid'
import { Manga } from '@workspace/types'
import { TrendingUp } from 'lucide-react'

// Pede ao backend os mangás ordenados por 'popular'
async function getPopularMangas(): Promise<Manga[]> {
	try {
		const res = await fetch('http://localhost:3333/mangas?sort=popular', { cache: 'no-store' })
		if (!res.ok) return []
		return res.json()
	} catch (error) {
		return []
	}
}

export default async function PopularPage() {
	const mangas = await getPopularMangas()

	return (
		<div className="dark min-h-screen bg-background text-foreground pb-20">
			<Header />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
				<div className="flex items-center gap-3 border-b border-border pb-6 mb-10">
					<TrendingUp className="h-10 w-10 text-primary" />
					<h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-foreground">
						Mais Populares
					</h1>
				</div>
				<MangaGrid mangas={mangas} />
			</main>
		</div>
	)
}
