'use client'

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import MangaGrid from './MangaGrid'
import { Manga } from '@workspace/types'

interface LatestUpdatesProps {
	mangas: Manga[]
}

export default function LatestUpdatesSection({ mangas }: LatestUpdatesProps) {
	const [selectedDay, setSelectedDay] = useState('Hoje')
	// Ajustei os dias para ter a semana completa se precisar
	const days = ['Hoje', 'Ontem', 'Dom', 'Sab', 'Sex', 'Qui', 'Qua']

	// LÓGICA DE FILTRAGEM DE DATAS
	const getFilteredMangas = () => {
		const today = new Date()
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		return mangas.filter((manga) => {
			// Usamos a data de atualização do mangá
			const updatedDate = new Date(manga.updatedAt || manga.createdAt)

			// Se a aba for "Hoje"
			if (selectedDay === 'Hoje') {
				return updatedDate.toDateString() === today.toDateString()
			}

			// Se a aba for "Ontem"
			if (selectedDay === 'Ontem') {
				return updatedDate.toDateString() === yesterday.toDateString()
			}

			// Se for um dia da semana (Dom, Seg, Ter...)
			const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
			const mangaDayStr = daysOfWeek[updatedDate.getDay()]

			// Para evitar que obras de "Hoje" apareçam na aba do dia da semana correspondente
			// (ex: Hoje é Sexta, a obra aparece em "Hoje" e em "Sex"), nós garantimos que
			// a obra tem mais de 2 dias se for filtrada pela sigla do dia.
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

			{/* Renderiza o Grid, ou uma mensagem se o filtro ficar vazio */}
			{filteredMangas.length > 0 ? (
				<MangaGrid mangas={filteredMangas} />
			) : (
				<div className="py-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl bg-brand-gray">
					Nenhuma atualização encontrada para{' '}
					<span className="font-bold">{selectedDay}</span>.
				</div>
			)}
		</div>
	)
}
