'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Loader2 } from 'lucide-react'
import { useToast } from '@workspace/ui/hooks/use-toast' // Caso use Sonner/Toast, senão pode usar alert

interface MangaRatingProps {
	mangaId: number
}

export function MangaRating({ mangaId }: MangaRatingProps) {
	const { data: session, status } = useSession()

	const [rating, setRating] = useState<number>(0)
	const [hoverRating, setHoverRating] = useState<number>(0)
	const [stats, setStats] = useState({ average: 0, total: 0 })
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	// 🔄 Carrega a média global e a nota do usuário caso ele esteja logado
	useEffect(() => {
		const loadRatingData = async () => {
			setIsLoading(true)
			try {
				// 1. Busca média global e total de votos
				const statsRes = await fetch(`http://localhost:3333/reviews/manga/${mangaId}/stats`)
				if (statsRes.ok) {
					const statsData = await statsRes.json()
					setStats(statsData)
				}

				// 2. Se logado, busca a nota específica que este usuário deu
				if (status === 'authenticated' && session?.user) {
					const userId = (session.user as any).id
					const userRatingRes = await fetch(
						`http://localhost:3333/reviews/user/${userId}/${mangaId}`
					)
					if (userRatingRes.ok) {
						const userRatingData = await userRatingRes.json()
						setRating(userRatingData.rating || 0)
					}
				}
			} catch (error) {
				console.error('Erro ao carregar dados de avaliação:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadRatingData()
	}, [mangaId, session, status])

	// ⚡ Envia a nota para o nosso novo endpoint de Upsert
	const handleVote = async (selectedRating: number) => {
		if (status !== 'authenticated' || !session?.user) {
			alert('Você precisa estar logado para avaliar esta obra!')
			return
		}

		setIsSubmitting(false)
		const userId = (session.user as any).id

		try {
			const response = await fetch('http://localhost:3333/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					mangaId,
					rating: selectedRating,
				}),
			})

			if (!response.ok) throw new Error('Falha ao registrar seu voto.')

			// Atualiza o estado local da nota do usuário
			setRating(selectedRating)

			// Recarrega os status globais (média atualizada instantaneamente)
			const statsRes = await fetch(`http://localhost:3333/reviews/manga/${mangaId}/stats`)
			if (statsRes.ok) {
				const statsData = await statsRes.json()
				setStats(statsData)
			}
		} catch (error) {
			console.error(error)
			alert('Erro ao processar sua avaliação.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Loader2 className="h-4 w-4 animate-spin text-primary" />
				<span>Calculando notas...</span>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-1.5">
			{/* Estrelas Interativas */}
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => {
					// Define se a estrela deve acender baseado no Hover ou na nota real já salva
					const isLit = hoverRating ? star <= hoverRating : star <= rating

					return (
						<button
							key={star}
							type="button"
							disabled={isSubmitting}
							onClick={() => handleVote(star)}
							onMouseEnter={() => setHoverRating(star)}
							onMouseLeave={() => setHoverRating(0)}
							className="text-yellow-500 hover:scale-110 transition-transform focus:outline-none disabled:opacity-50 disabled:hover:scale-100"
						>
							<Star
								className={`h-6 w-6 transition-colors ${
									isLit
										? 'fill-current text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]'
										: 'text-gray-600'
								}`}
							/>
						</button>
					)
				})}

				{/* Exibição numérica da Média */}
				<span className="text-primary font-bold text-md ml-2">
					({stats.average > 0 ? stats.average.toFixed(1) : '0.0'})
				</span>
			</div>

			{/* Total de Votos */}
			<p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
				{stats.total === 0
					? 'Nenhuma avaliação'
					: stats.total === 1
						? '1 avaliação'
						: `${stats.total} avaliações`}
			</p>
		</div>
	)
}
