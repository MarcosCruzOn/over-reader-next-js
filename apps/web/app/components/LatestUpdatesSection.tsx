'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import MangaGrid from './MangaGrid'
import { useSession } from 'next-auth/react'

// 🔥 Importando a nossa URL da nuvem!
import { API_URL } from '@/app/lib/api'

export default function LatestUpdatesSection() {
	const { data: session } = useSession()
	const [selectedDay, setSelectedDay] = useState('Hoje')
	const [favoritedIds, setFavoritedIds] = useState<number[]>([])

	// 🔥 NOVO ESTADO: Guarda os lançamentos reais vindos da nova API
	const [feed, setFeed] = useState<any[]>([])

	const days = ['Hoje', 'Ontem', 'Dom', 'Sab', 'Sex', 'Qui', 'Qua']

	// 🔄 Busca o Feed de Lançamentos
	useEffect(() => {
		// 🔥 Corrigido
		fetch(`${API_URL}/chapters/feed/latest?limit=50`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => setFeed(data))
			.catch(console.error)
	}, [])

	// 🔄 Busca os favoritos para pintar a fita vermelha
	useEffect(() => {
		if (session?.user) {
			const userId = (session.user as any).id
			// 🔥 Corrigido
			fetch(`${API_URL}/favorites/user/${userId}`)
				.then((res) => (res.ok ? res.json() : []))
				.then((data) => {
					setFavoritedIds(data.map((fav: any) => fav.mangaId))
				})
				.catch(console.error)
		}
	}, [session])

	// Filtra os lançamentos com base no dia da semana escolhido
	const getFilteredFeed = () => {
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		return feed.filter((item) => {
			const updatedDate = new Date(item.createdAt) // Usa a data real de criação do capítulo
			if (selectedDay === 'Hoje') return updatedDate.toDateString() === today.toDateString()
			if (selectedDay === 'Ontem')
				return updatedDate.toDateString() === yesterday.toDateString()

			const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
			const mangaDayStr = daysOfWeek[updatedDate.getDay()]
			const isOlderThanYesterday = updatedDate < yesterday

			return selectedDay === mangaDayStr && isOlderThanYesterday
		})
	}

	const filteredFeed = getFilteredFeed()

	// 🔥 A MÁGICA: Transformamos o item do Feed num formato que o MangaGrid entenda,
	// mas passando a CAPA DO VOLUME como se fosse a capa principal!
	const adaptedMangas = filteredFeed.map((item) => ({
		id: item.mangaId,
		title: item.mangaTitle,
		coverUrl: item.volumeCover, // Substitui a capa do mangá pela capa do volume
		updatedAt: item.createdAt,
	}))

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

			{adaptedMangas.length > 0 ? (
				<MangaGrid mangas={adaptedMangas as any} favoritedIds={favoritedIds} />
			) : (
				<div className="py-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl bg-brand-gray">
					Nenhuma atualização encontrada para{' '}
					<span className="font-bold">{selectedDay}</span>.
				</div>
			)}
		</div>
	)
}
