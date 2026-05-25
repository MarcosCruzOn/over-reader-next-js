'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, Heart, MoreVertical, Send, Loader2, Flag } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

interface Comment {
	id: number
	text: string
	createdAt: string
	likesCount: number
	isLiked: boolean
	user: {
		id: string
		name: string | null
		image: string | null
	}
}

export function ChapterComments({ chapterId }: { chapterId: string | number }) {
	const { data: session, status } = useSession()
	const [comments, setComments] = useState<Comment[]>([])
	const [newComment, setNewComment] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const fetchComments = useCallback(async () => {
		try {
			const userId = session?.user ? (session.user as any).id : ''
			const url = `http://localhost:3333/comments/chapter/${chapterId}${userId ? `?userId=${userId}` : ''}`

			const res = await fetch(url)
			if (res.ok) {
				const data = await res.json()
				setComments(data)
			}
		} catch (error) {
			console.error('Erro ao buscar comentários:', error)
		} finally {
			setIsLoading(false)
		}
	}, [chapterId, session])

	useEffect(() => {
		fetchComments()
	}, [fetchComments])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session?.user) return alert('Você precisa estar logado para comentar.')
		if (!newComment.trim()) return

		setIsSubmitting(true)
		try {
			const userId = (session.user as any).id
			const res = await fetch('http://localhost:3333/comments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// Garantimos que o chapterId vai como Número
				body: JSON.stringify({ userId, chapterId: Number(chapterId), text: newComment }),
			})

			if (res.ok) {
				setNewComment('')
				fetchComments() // Recarrega a lista
			} else {
				// 🔥 AGORA NÃO HÁ ERROS SILENCIOSOS!
				const errorData = await res.json()
				alert(`Erro ao comentar: ${errorData.error || 'Falha no servidor'}`)
			}
		} catch (error) {
			console.error('Erro ao postar comentário:', error)
			alert('Falha na comunicação com o servidor.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleLike = async (commentId: number) => {
		if (!session?.user) return alert('Faça login para curtir!')

		// Otimização Otimista: Atualiza a UI antes mesmo do servidor responder
		setComments(
			comments.map((c) => {
				if (c.id === commentId) {
					return {
						...c,
						isLiked: !c.isLiked,
						likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
					}
				}
				return c
			})
		)

		try {
			const userId = (session.user as any).id
			await fetch('http://localhost:3333/comments/like', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, commentId }),
			})
		} catch (error) {
			console.error('Erro ao curtir:', error)
			fetchComments() // Se falhar, reverte buscando a verdade do banco
		}
	}

	const handleReport = async (commentId: number) => {
		if (!session?.user) return alert('Faça login para denunciar.')
		const reason = window.prompt('Qual o motivo da denúncia? (Ex: Spoiler, Ofensa, Spam)')
		if (!reason) return

		try {
			const userId = (session.user as any).id
			const res = await fetch('http://localhost:3333/comments/report', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, commentId, reason }),
			})
			if (res.ok) alert('Denúncia enviada para a moderação. Obrigado!')
		} catch (error) {
			console.error('Erro ao denunciar:', error)
		}
	}

	return (
		<div className="flex flex-col h-full w-full">
			{/* Área de rolagem dos comentários */}
			<div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-4">
				{isLoading ? (
					<div className="flex justify-center py-10">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
					</div>
				) : comments.length > 0 ? (
					comments.map((comment) => (
						<div
							key={comment.id}
							className="flex gap-3 animate-in fade-in slide-in-from-bottom-2"
						>
							<img
								src={
									comment.user.image ||
									'https://placehold.co/100x100/1a1a1a/white.png?text=U'
								}
								alt={comment.user.name || 'User'}
								className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between gap-2 bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
									<div className="flex flex-col min-w-0">
										<span className="font-bold text-sm text-white truncate">
											{comment.user.name || 'Usuário Anônimo'}
										</span>
										<p className="text-gray-300 text-sm mt-1 break-words whitespace-pre-wrap">
											{comment.text}
										</p>
									</div>
									{/* Três pontinhos da denúncia */}
									<DropdownMenu>
										<DropdownMenuTrigger className="shrink-0 text-gray-500 hover:text-white transition-colors focus:outline-none self-start -mt-1 -mr-1">
											<MoreVertical className="w-4 h-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="bg-[#1a1a1a] border-white/10 text-white"
										>
											<DropdownMenuItem
												className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
												onClick={() => handleReport(comment.id)}
											>
												<Flag className="w-4 h-4 mr-2" /> Denunciar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								{/* Botão de Curtir e Data */}
								<div className="flex items-center gap-4 mt-1.5 ml-1">
									<button
										onClick={() => handleLike(comment.id)}
										className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${comment.isLiked ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
									>
										<Heart
											className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`}
										/>
										{comment.likesCount > 0 && (
											<span>{comment.likesCount}</span>
										)}
									</button>
									<span className="text-[10px] text-gray-600 font-medium uppercase">
										{new Date(comment.createdAt).toLocaleDateString('pt-BR')}
									</span>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center text-muted-foreground py-20 border-2 border-dashed border-white/10 rounded-xl h-full">
						<MessageSquare className="w-12 h-12 mb-4 opacity-20" />
						<p className="font-bold text-white">Seja o primeiro a comentar!</p>
					</div>
				)}
			</div>

			{/* Input para escrever o comentário colado no fundo */}
			<div className="pt-4 border-t border-white/10 mt-auto bg-[#0a0a0a]">
				{status === 'authenticated' ? (
					<form onSubmit={handleSubmit} className="flex items-end gap-2">
						<div className="flex-1 relative">
							<Input
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Escreva seu comentário..."
								className="bg-white/5 border-white/10 text-white pr-10 resize-none h-11 rounded-xl"
								maxLength={500}
							/>
						</div>
						<Button
							type="submit"
							disabled={isSubmitting || !newComment.trim()}
							size="icon"
							className="h-11 w-11 shrink-0 rounded-xl bg-primary hover:bg-brand-dark text-white"
						>
							{isSubmitting ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<Send className="w-5 h-5 ml-0.5" />
							)}
						</Button>
					</form>
				) : (
					<div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
						<p className="text-sm text-gray-400">
							Faça login para interagir com a comunidade.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
