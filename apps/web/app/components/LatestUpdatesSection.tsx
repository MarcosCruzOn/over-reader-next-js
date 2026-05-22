'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import MangaGrid from './MangaGrid'
import { Manga } from '@workspace/types'
// 🔥 IMPORTAÇÃO DA SESSÃO PARA BUSCAR FAVORITOS
import { useSession } from 'next-auth/react'

interface LatestUpdatesProps {
	mangas: Manga[]
}

export default function LatestUpdatesSection({ mangas }: LatestUpdatesProps) {
	const { data: session } = useSession()
	const [selectedDay, setSelectedDay] = useState('Hoje')
	// 🔥 NOVO ESTADO: Guarda os IDs dos mangás favoritados
	const [favoritedIds, setFavoritedIds] = useState<number[]>([])

	const days = ['Hoje', 'Ontem', 'Dom', 'Sab', 'Sex', 'Qui', 'Qua']

	// Busca os favoritos para pintar a fita vermelha nos cards
	useEffect(() => {
		if (session?.user) {
			const userId = (session.user as any).id
			fetch(`http://localhost:3333/favorites/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					// Extrai apenas os números (IDs) para facilitar a verificação nos cards
					setFavoritedIds(data.map((fav: any) => fav.mangaId))
				})
				.catch(console.error)
		}
	}, [session])

	const getFilteredMangas = () => {
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		return mangas.filter((manga) => {
			const updatedDate = new Date(manga.updatedAt || manga.createdAt)
			if (selectedDay === 'Hoje') return updatedDate.toDateString() === today.toDateString()
			if (selectedDay === 'Ontem')
				return updatedDate.toDateString() === yesterday.toDateString()

			const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
			const mangaDayStr = daysOfWeek[updatedDate.getDay()]
			const isOlderThanYesterday = updatedDate < yesterday

			return selectedDay === mangaDayStr && isOlderThanYesterday
		})
	}

	const filteredMangas = getFilteredMangas()

	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
				<h2 className="text-3xl md:text-4xl font-bold text-white">Atualizações Recentes</h2>

				<Tabs
					value={selectedDay}
					onValueChange={setSelectedDay}
					className="w-full sm:w-auto"
				>
					<TabsList className="bg-brand-gray border border-gray-800 grid grid-cols-7 w-full sm:w-auto">
						{days.map((day) => (
							<TabsTrigger
								key={day}
								value={day}
								className="text-gray-400 text-xs sm:text-sm font-medium px-2 sm:px-4"
							>
								{day}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{filteredMangas.length > 0 ? (
				// 🔥 AGORA PASSAMOS OS FAVORITOS PARA O GRID
				<MangaGrid mangas={filteredMangas} favoritedIds={favoritedIds} />
			) : (
				<div className="py-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl bg-brand-gray">
					Nenhuma atualização encontrada para{' '}
					<span className="font-bold">{selectedDay}</span>.
				</div>
			)}
		</div>
	)
}
