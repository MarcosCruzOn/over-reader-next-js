'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MessageSquare, Heart, MoreVertical, Send, Loader2, Flag, Reply, X } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

// 🔥 Importando a nossa URL da nuvem!
import { API_URL } from '@/app/lib/api'

interface Comment {
	id: number
	text: string
	parentId: number | null
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

	const [replyingTo, setReplyingTo] = useState<{
		rootId: number
		targetId: number
		name: string
	} | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const fetchComments = useCallback(async () => {
		try {
			const userId = session?.user ? (session.user as any).id : ''
			// 🔥 Corrigido
			const url = `${API_URL}/comments/chapter/${chapterId}${userId ? `?userId=${userId}` : ''}`
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
		// Criamos uma função assíncrona interna para o linter entender
		// que a execução não vai travar a renderização da tela.
		const loadComments = async () => {
			await fetchComments()
		}

		loadComments()
	}, [fetchComments])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session?.user) return
		if (!newComment.trim()) return

		setIsSubmitting(true)
		try {
			const userId = (session.user as any).id
			// 🔥 Corrigido
			const res = await fetch(`${API_URL}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					chapterId: Number(chapterId),
					text: newComment,
					parentId: replyingTo?.rootId || null,
					targetCommentId: replyingTo?.targetId || null,
				}),
			})

			if (res.ok) {
				setNewComment('')
				setReplyingTo(null)
				fetchComments()
			}
		} catch (error) {
			console.error('Erro ao postar comentário:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleLike = async (commentId: number) => {
		if (!session?.user) return
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
			// 🔥 Corrigido
			await fetch(`${API_URL}/comments/like`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, commentId }),
			})
		} catch (error) {
			fetchComments()
		}
	}

	const handleReplyClick = (commentId: number, parentId: number | null, userName: string) => {
		const rootId = parentId || commentId
		setReplyingTo({ rootId, targetId: commentId, name: userName })
		setTimeout(() => inputRef.current?.focus(), 100)
	}

	const handleReport = async (commentId: number) => {
		if (!session?.user) return alert('Faça login para denunciar.')
		const reason = window.prompt('Qual o motivo da denúncia? (Ex: Spoiler, Ofensa, Spam)')
		if (!reason) return

		try {
			const userId = (session.user as any).id
			// 🔥 Corrigido
			const res = await fetch(`${API_URL}/comments/report`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, commentId, reason }),
			})
			if (res.ok) alert('Denúncia enviada para a moderação. Obrigado!')
		} catch (error) {
			console.error('Erro ao denunciar:', error)
		}
	}

	const rootComments = comments.filter((c) => c.parentId === null)
	const replies = comments.filter((c) => c.parentId !== null)

	const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
		<div
			className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${isReply ? 'mt-4' : 'mt-2'}`}
		>
			<img
				src={comment.user.image || 'https://placehold.co/100x100/1a1a1a/white.png?text=U'}
				alt={comment.user.name || 'User'}
				className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover shrink-0 border border-white/10 shadow-md`}
			/>
			<div className="flex-1 min-w-0">
				{/* BALÃO DE TEXTO MELHORADO */}
				<div
					className={`flex flex-col p-3 rounded-2xl rounded-tl-none border shadow-sm ${isReply ? 'bg-white/5 border-white/5' : 'bg-brand-gray/50 border-white/10'}`}
				>
					<div className="flex items-center justify-between gap-2 mb-1">
						<span
							className={`font-bold text-xs uppercase tracking-tight ${isReply ? 'text-primary' : 'text-white'}`}
						>
							{comment.user.name || 'Anônimo'}
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger className="shrink-0 text-gray-500 hover:text-white transition-colors focus:outline-none">
								<MoreVertical className="w-3.5 h-3.5" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="bg-brand-gray border-white/10 text-white"
							>
								<DropdownMenuItem
									className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
									onClick={() => handleReport(comment.id)}
								>
									<Flag className="w-3.5 h-3.5 mr-2" /> Denunciar
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p className="text-zinc-200 text-[13.5px] leading-relaxed break-words whitespace-pre-wrap">
						{comment.text}
					</p>
				</div>

				{/* AÇÕES ABAIXO DO BALÃO */}
				<div className="flex items-center gap-5 mt-2 ml-1">
					<button
						onClick={() => handleLike(comment.id)}
						className={`flex items-center gap-1.5 text-[11px] font-black uppercase transition-colors ${comment.isLiked ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
					>
						<Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
						{comment.likesCount > 0 && <span>{comment.likesCount}</span>}
					</button>

					<button
						onClick={() =>
							handleReplyClick(
								comment.id,
								comment.parentId,
								comment.user.name || 'Usuário'
							)
						}
						className="flex items-center gap-1.5 text-[11px] font-black uppercase text-zinc-500 hover:text-white transition-colors"
					>
						<Reply className="w-3.5 h-3.5" /> Responder
					</button>

					<span className="text-[9px] text-zinc-600 font-bold uppercase ml-auto tracking-widest">
						{new Date(comment.createdAt).toLocaleDateString('pt-BR')}
					</span>
				</div>
			</div>
		</div>
	)

	return (
		<div className="flex flex-col h-full w-full bg-[#0a0a0a]">
			{/* ÁREA DE SCROLL */}
			<div className="flex-1 overflow-y-auto px-6 py-2 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{isLoading ? (
					<div className="flex justify-center py-20">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
					</div>
				) : rootComments.length > 0 ? (
					rootComments.map((rootComment) => (
						<div key={rootComment.id} className="relative">
							<CommentItem comment={rootComment} />

							{/* RESPOSTAS ANINHADAS COM LINHA GUIA */}
							{replies.filter((r) => r.parentId === rootComment.id).length > 0 && (
								<div className="ml-6 pl-4 border-l border-white/10 mt-2 space-y-4">
									{replies
										.filter((r) => r.parentId === rootComment.id)
										.map((reply) => (
											<CommentItem
												key={reply.id}
												comment={reply}
												isReply={true}
											/>
										))}
								</div>
							)}
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center text-zinc-500 py-20 border-2 border-dashed border-white/5 rounded-2xl h-full mx-4">
						<MessageSquare className="w-12 h-12 mb-4 opacity-10" />
						<p className="font-black uppercase tracking-tighter text-zinc-400">
							Silêncio no capítulo...
						</p>
						<p className="text-xs uppercase font-bold opacity-50 mt-1">
							Seja o primeiro a comentar!
						</p>
					</div>
				)}
			</div>

			{/* FOOTER: ÁREA DE INPUT FIXA E ALINHADA */}
			<div className="p-4 border-t border-white/5 bg-[#0d0d0d] shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
				{status === 'authenticated' ? (
					<form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-full">
						{replyingTo && (
							<div className="flex items-center justify-between bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider animate-in slide-in-from-bottom-2">
								<span className="flex items-center gap-2">
									<Reply className="w-3.5 h-3.5 rotate-180" />
									Respondendo a {replyingTo.name}
								</span>
								<button
									type="button"
									onClick={() => setReplyingTo(null)}
									className="hover:bg-primary/20 p-1 rounded-full transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						)}

						<div className="flex items-center gap-2 h-12">
							<div className="flex-1 h-full">
								<Input
									ref={inputRef}
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									placeholder={
										replyingTo
											? 'Sua resposta...'
											: 'Diga algo sobre o capítulo...'
									}
									className="w-full h-full bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-xl px-4 text-sm font-medium transition-all"
									maxLength={500}
								/>
							</div>
							<Button
								type="submit"
								disabled={isSubmitting || !newComment.trim()}
								className="h-12 w-12 shrink-0 rounded-xl bg-primary hover:bg-brand-dark text-white shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center p-0"
							>
								{isSubmitting ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									<Send className="w-5 h-5 ml-1" />
								)}
							</Button>
						</div>
					</form>
				) : (
					<div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
						<p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
							Faça{' '}
							<Link href="/login" className="text-primary hover:underline">
								Login
							</Link>{' '}
							para participar da conversa.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
