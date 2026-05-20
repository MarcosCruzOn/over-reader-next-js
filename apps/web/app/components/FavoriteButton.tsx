'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
	mangaId: number
}

export function FavoriteButton({ mangaId }: FavoriteButtonProps) {
	const { data: session, status } = useSession()
	const router = useRouter()

	const [isFavorited, setIsFavorited] = useState(false)
	const [isLoading, setIsLoading] = useState(true) // Começa carregando para evitar piscar errado

	// 🔥 1. A CURA DA AMNÉSIA: Verificar o estado inicial ao carregar a página
	useEffect(() => {
		const checkStatus = async () => {
			if (status === 'unauthenticated' || !session?.user) {
				setIsLoading(false)
				return
			}

			try {
				const userId = (session.user as any).id
				const response = await fetch(
					`http://localhost:3333/favorites/check/${userId}/${mangaId}`
				)
				if (response.ok) {
					const data = await response.json()
					setIsFavorited(data.isFavorited)
				}
			} catch (error) {
				console.error('Erro ao checar favoritos:', error)
			} finally {
				setIsLoading(false)
			}
		}

		checkStatus()
	}, [session, status, mangaId])

	// 🔥 2. A AÇÃO DE TOGGLE: Salvar ou Remover
	const handleToggleFavorite = async () => {
		if (!session?.user) {
			alert('Você precisa estar logado para favoritar um mangá no Over Reader!')
			router.push('/login')
			return
		}

		const userId = (session.user as any).id
		setIsLoading(true)

		try {
			if (isFavorited) {
				// Se já for favorito, DELETA!
				const response = await fetch(
					`http://localhost:3333/favorites/${userId}/${mangaId}`,
					{
						method: 'DELETE',
					}
				)

				if (!response.ok) throw new Error('Falha ao remover dos favoritos.')
				setIsFavorited(false)
			} else {
				// Se não for, SALVA!
				const response = await fetch('http://localhost:3333/favorites', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId, mangaId: Number(mangaId) }),
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error(errorData.error || 'Falha ao salvar no servidor.')
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

	return (
		<Button
			onClick={handleToggleFavorite}
			disabled={isLoading}
			variant="outline"
			size="sm"
			className={`gap-2 font-semibold transition-all rounded-md px-4 py-2 h-auto ${
				isFavorited
					? 'bg-red-900/20 border-[#C41E3A] text-[#C41E3A] hover:bg-red-900/40 hover:text-red-400'
					: 'bg-transparent border-[#C41E3A]/50 text-[#C41E3A] hover:bg-[#C41E3A]/10'
			}`}
		>
			<Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
			{isFavorited ? 'Salvo' : 'Adicionar aos Favoritos'}
		</Button>
	)
}
