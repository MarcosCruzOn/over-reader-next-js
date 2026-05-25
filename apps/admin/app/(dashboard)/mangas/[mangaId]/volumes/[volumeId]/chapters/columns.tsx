'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export type Chapter = {
	id: number
	volumeId: number
	chapterNumber: number
	title: string | null
	pages: string[] // Array de URLs das imagens
}

// O nosso componente de Ações isolado (com o botão de deletar e o Link de editar)
const ChapterActionsCell = ({ chapter }: { chapter: Chapter }) => {
	const router = useRouter()
	const params = useParams()

	// Pegamos os IDs diretamente da URL atual da página
	const mangaId = params.mangaId
	const volumeId = params.volumeId

	const [isDeleting, setIsDeleting] = React.useState(false)

	const handleDelete = async () => {
		if (
			!window.confirm(
				`Tem certeza que deseja deletar o Capítulo ${chapter.chapterNumber}? Todas as imagens sumirão do aplicativo.`
			)
		) {
			return
		}

		setIsDeleting(true)
		try {
			const res = await fetch(`http://localhost:3333/chapters/${chapter.id}`, {
				method: 'DELETE',
			})

			if (!res.ok) throw new Error('Falha ao deletar capítulo')

			// Atualiza a tabela magicamente
			router.refresh()
		} catch (error) {
			console.error(error)
			alert('Erro ao deletar o capítulo.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className="flex items-center gap-2">
			{/* Botão de Editar */}
			<Link href={`/mangas/${mangaId}/volumes/${volumeId}/chapters/${chapter.id}/edit`}>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-muted-foreground hover:text-primary"
				>
					<Edit className="h-4 w-4" />
				</Button>
			</Link>

			{/* Botão de Deletar */}
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

export const columns: ColumnDef<Chapter>[] = [
	{
		id: 'cover',
		header: 'Capa / Preview',
		cell: ({ row }) => {
			// Pegamos as páginas do capítulo [cite: 3]
			const pages = row.original.pages
			// A "Capa" será a primeira página do array (se existir)
			const firstPage = pages && pages.length > 0 ? pages[0] : null

			return firstPage ? (
				<img
					src={firstPage}
					alt="Preview"
					className="h-16 w-12 object-cover rounded-sm border border-border"
				/>
			) : (
				<div className="h-16 w-12 bg-muted rounded-sm flex items-center justify-center border border-border">
					<ImageIcon className="h-4 w-4 text-muted-foreground" />
				</div>
			)
		},
	},
	{
		accessorKey: 'chapterNumber',
		header: 'Capítulo',
		cell: ({ row }) => (
			<span className="font-bold text-lg">Cap. {row.getValue('chapterNumber')}</span>
		),
	},
	{
		accessorKey: 'title',
		header: 'Título',
		cell: ({ row }) => {
			const title = row.getValue('title') as string | null
			return title ? title : <span className="text-muted-foreground italic">Sem título</span>
		},
	},
	{
		accessorKey: 'pages',
		header: 'Páginas',
		cell: ({ row }) => {
			// Como pages é um JSON array, podemos ver o tamanho (length) dele [cite: 3]
			const pages = row.getValue('pages') as string[]
			const count = pages && Array.isArray(pages) ? pages.length : 0

			return (
				<div className="flex items-center gap-2 text-muted-foreground">
					<ImageIcon className="h-4 w-4" />
					<span>
						{count} {count === 1 ? 'página' : 'páginas'}
					</span>
				</div>
			)
		},
	},
	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => <ChapterActionsCell chapter={row.original} />,
	},
]
