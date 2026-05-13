'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BookCopy, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export type Manga = {
	id: number
	title: string
	author: string
	coverUrl: string | null
	status: string
	releaseYear: number | null
}

// 🚀 O Pulo do Gato: Criamos um componente React só para a célula de Ações.
// Assim podemos usar hooks como useState e useRouter sem quebrar a tabela!
const MangaActionsCell = ({ manga }: { manga: Manga }) => {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = React.useState(false)

	const handleDelete = async () => {
		// Alerta de segurança antes de explodir tudo
		if (
			!window.confirm(
				`Tem certeza que deseja deletar "${manga.title}"? \nIsso apagará TODOS os volumes e capítulos também!`
			)
		) {
			return
		}

		setIsDeleting(true)
		try {
			const res = await fetch(`http://localhost:3333/mangas/${manga.id}`, {
				method: 'DELETE',
			})

			if (!res.ok) throw new Error('Falha ao deletar mangá')

			// Atualiza a tabela magicamente sem precisar dar F5 na página
			router.refresh()
		} catch (error) {
			console.error(error)
			alert('Erro ao deletar o mangá.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className="flex items-center gap-2">
			<Link href={`/mangas/${manga.id}/volumes`}>
				<Button
					variant="outline"
					size="sm"
					className="h-8 gap-1 border-primary/50 text-primary hover:bg-primary/10"
				>
					<BookCopy className="h-4 w-4" />
					<span>Volumes</span>
				</Button>
			</Link>

			{/* Botão de Editar (Novo!) */}
			<Link href={`/mangas/${manga.id}/edit`}>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground hover:text-primary"
				>
					<Edit className="h-4 w-4" />
				</Button>
			</Link>

			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 text-destructive hover:bg-destructive/10"
				onClick={handleDelete}
				disabled={isDeleting}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}

export const columns: ColumnDef<Manga>[] = [
	{
		accessorKey: 'coverUrl',
		header: 'Capa',
		cell: ({ row }) => {
			const coverUrl = row.getValue('coverUrl') as string | null
			return coverUrl ? (
				<Image
					src={coverUrl}
					alt="Capa"
					className="h-12 w-8 object-cover rounded-sm border border-border"
					loading="lazy"
				/>
			) : (
				<div className="h-12 w-8 bg-muted rounded-sm flex items-center justify-center border border-border">
					<ImageIcon className="h-4 w-4 text-muted-foreground" />
				</div>
			)
		},
	},
	{
		accessorKey: 'title',
		header: 'Título',
		cell: ({ row }) => <span className="font-bold">{row.getValue('title')}</span>,
	},
	{
		accessorKey: 'author',
		header: 'Autor',
		cell: ({ row }) => row.getValue('author'),
	},
	{
		accessorKey: 'releaseYear',
		header: 'Ano',
		cell: ({ row }) => row.getValue('releaseYear') || '-',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string
			return (
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold 
          ${
				status === 'Em andamento'
					? 'bg-blue-500/20 text-blue-500'
					: status === 'Concluído'
						? 'bg-green-500/20 text-green-500'
						: 'bg-muted text-muted-foreground'
			}`}
				>
					{status.toUpperCase()}
				</span>
			)
		},
	},
	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => <MangaActionsCell manga={row.original} />, // Usamos o nosso componente aqui!
	},
]
