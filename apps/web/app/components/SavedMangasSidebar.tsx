'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// 🔥 Importando a nossa URL da nuvem!
import { API_URL } from '@/app/lib/api'

export default function SavedMangasSidebar() {
	const { data: session } = useSession()
	const [savedUpdates, setSavedUpdates] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function fetchSavedUpdates() {
			if (!session?.user) {
				setIsLoading(false)
				return
			}

			try {
				const userId = (session.user as any).id

				// 1. Buscamos os mangás que o usuário favoritou (🔥 Corrigido)
				const favRes = await fetch(`${API_URL}/favorites/user/${userId}`)
				const favData = favRes.ok ? await favRes.json() : []
				const favoritedIds = favData.map((fav: any) => fav.mangaId)

				if (favoritedIds.length === 0) {
					setSavedUpdates([])
					setIsLoading(false)
					return
				}

				// 2. Buscamos o feed global de lançamentos (🔥 Corrigido)
				const feedRes = await fetch(`${API_URL}/chapters/feed/latest?limit=50`)
				const feedData = feedRes.ok ? await feedRes.json() : []

				// 3. A Mágica: Filtramos o feed para manter APENAS os mangás que o usuário favoritou!
				const filteredUpdates = feedData.filter((item: any) =>
					favoritedIds.includes(item.mangaId)
				)

				// 4. Limitamos aos 5 mais recentes para não quebrar o layout da Sidebar
				setSavedUpdates(filteredUpdates.slice(0, 5))
			} catch (error) {
				console.error('Erro ao buscar atualizações dos salvos:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSavedUpdates()
	}, [session])

	// Mostra um spinner discreto enquanto carrega os dados
	if (isLoading) {
		return (
			<aside className="hidden lg:block">
				<div className="bg-brand-gray border border-gray-800 rounded-2xl p-6 shadow-lg sticky top-24 flex justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
				</div>
			</aside>
		)
	}

	// Se o usuário não tem favoritos ou nenhum favorito teve atualização, ocultamos a sidebar
	if (savedUpdates.length === 0) return null

	return (
		<aside className="hidden lg:block">
			<div className="bg-brand-gray border border-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">
				<h3 className="text-xl font-bold text-gray-100 mb-6">
					Atualizações dos seus Salvos
				</h3>

				<div className="space-y-4">
					{savedUpdates.map((item) => {
						// 🔥 Garantindo que a imagem usa a URL correta da API
						const rawImageUrl = item.volumeCover
							? item.volumeCover
							: 'https://placehold.co/80x120/1a1a1a/white.png?text=Sem+Capa'

						const imageUrl = rawImageUrl.startsWith('http')
							? rawImageUrl
							: `${API_URL}${rawImageUrl}`

						return (
							<Link key={item.chapterId} href={`/mangas/${item.mangaId}`}>
								<div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group">
									<div className="shrink-0 relative w-12 h-16">
										<Image
											src={imageUrl}
											alt={item.mangaTitle}
											fill
											sizes="48px"
											className="object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
											unoptimized={true} // 🔥 Ajustado para funcionar perfeitamente com a AWS/Nuvem
											loading="lazy"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-gray-100 text-sm line-clamp-1 group-hover:text-brand-primary transition-colors">
											{item.mangaTitle}
										</h4>
										<p className="text-xs text-gray-500 mt-0.5">
											ATUAL:{' '}
											<span className="font-medium text-brand-primary">
												CH. {item.chapterNumber}
											</span>
										</p>
									</div>
								</div>
							</Link>
						)
					})}
				</div>

				<Link
					href="/saved"
					className="mt-6 flex items-center justify-between w-full p-3 bg-gray-950 hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
				>
					<span className="text-sm font-medium text-gray-400 group-hover:text-brand-primary transition-colors">
						Ver sua biblioteca
					</span>
					<ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200" />
				</Link>
			</div>
		</aside>
	)
}
