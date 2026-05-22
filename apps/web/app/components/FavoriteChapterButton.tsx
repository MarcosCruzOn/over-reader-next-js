'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useRouter } from 'next/navigation'

interface FavoriteChapterButtonProps {
	chapterId: number
	variant?: 'icon' | 'full' // 'icon' para a lista, 'full' para o leitor
}

export function FavoriteChapterButton({ chapterId, variant = 'icon' }: FavoriteChapterButtonProps) {
	const { data: session, status } = useSession()
	const router = useRouter()

	const [isFavorited, setIsFavorited] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	// Verifica se o capítulo já está favoritado quando o componente carrega na tela
	useEffect(() => {
		const checkStatus = async () => {
			if (status === 'unauthenticated' || !session?.user) {
				setIsLoading(false)
				return
			}

			try {
				const userId = (session.user as any).id
				const response = await fetch(
					`http://localhost:3333/favorite-chapters/check/${userId}/${chapterId}`
				)
				if (response.ok) {
					const data = await response.json()
					setIsFavorited(data.isFavorited)
				}
			} catch (error) {
				console.error('Erro ao checar capítulo favorito:', error)
			} finally {
				setIsLoading(false)
			}
		}

		checkStatus()
	}, [session, status, chapterId])

	const handleToggleFavorite = async (e: React.MouseEvent) => {
		// 🔥 Muito importante: Impede que o clique no botão ative links que estejam em volta dele!
		e.preventDefault()

		if (!session?.user) {
			alert('Você precisa estar logado para marcar um capítulo!')
			router.push('/login')
			return
		}

		const userId = (session.user as any).id
		setIsLoading(true)

		try {
			if (isFavorited) {
				// Remover favorito
				const response = await fetch(
					`http://localhost:3333/favorite-chapters/${userId}/${chapterId}`,
					{
						method: 'DELETE',
					}
				)
				if (!response.ok) throw new Error('Falha ao remover a marcação.')
				setIsFavorited(false)
			} else {
				// Adicionar favorito
				const response = await fetch('http://localhost:3333/favorite-chapters', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId, chapterId: Number(chapterId) }),
				})
				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || 'Falha ao salvar a marcação.')
				}
				setIsFavorited(true)
			}
		} catch (error: any) {
			console.error(error)
			alert(`Erro: ${error.message}`)
		} finally {
			setIsLoading(false)
		}
	}

	// VARIANTE 1: Apenas o ícone (Para a lista de capítulos)
	if (variant === 'icon') {
		return (
			<Button
				onClick={handleToggleFavorite}
				disabled={isLoading}
				variant="ghost"
				size="icon"
				title={isFavorited ? 'Remover marcação' : 'Marcar capítulo'}
				className={`rounded-full transition-all hover:scale-110 h-8 w-8 shrink-0 ${
					isFavorited
						? 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-400/10'
						: 'text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10'
				}`}
			>
				<Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
			</Button>
		)
	}

	// VARIANTE 2: Botão completo com texto (Para dentro do leitor)
	return (
		<Button
			onClick={handleToggleFavorite}
			disabled={isLoading}
			variant="outline"
			className={`gap-2 font-bold transition-all w-full sm:w-auto ${
				isFavorited
					? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/10'
					: 'border-border text-foreground hover:border-yellow-400 hover:text-yellow-400'
			}`}
		>
			<Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
			{isFavorited ? 'Capítulo Marcado' : 'Marcar Capítulo'}
		</Button>
	)
}
