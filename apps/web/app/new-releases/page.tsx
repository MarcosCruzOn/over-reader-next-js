import React from 'react'
import Header from '@/app/components/Header'
import MangaGrid from '@/app/components/MangaGrid'
import { Manga } from '@workspace/types'
import { Flame } from 'lucide-react'

// 🔥 Importando a nossa central conectada à nuvem!
import { api } from '@/app/lib/api'

export default async function NewReleasesPage() {
	// Puxando os dados dinamicamente direto da API na AWS
	const mangas: Manga[] = await api.getNewReleases()

	return (
		<div className="dark min-h-screen bg-background text-foreground pb-20">
			<Header />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
				<div className="flex items-center gap-3 border-b border-border pb-6 mb-10">
					<Flame className="h-10 w-10 text-primary" />
					<h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-foreground">
						Lançamentos Recentes
					</h1>
				</div>
				{/* Passando os dados limpos para o Grid renderizar as capas */}
				<MangaGrid mangas={mangas} />
			</main>
		</div>
	)
}
