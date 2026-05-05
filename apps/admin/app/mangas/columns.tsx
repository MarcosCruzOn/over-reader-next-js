'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { BookCopy, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

// 1. Atualizamos a tipagem para incluir os campos que o backend já nos manda
export type Manga = {
	id: number
	title: string
	author: string
	coverUrl: string | null
	status: string
	releaseYear: number | null
}

export const columns: ColumnDef<Manga>[] = [
	// 2. Removemos o objeto do "id" e adicionamos a Capa logo no início
	{
		accessorKey: 'coverUrl',
		header: 'Capa',
		cell: ({ row }) => {
			const coverUrl = row.getValue('coverUrl') as string | null

			// Se tiver capa, mostra a imagem arredondada. Se não, mostra um ícone de fallback.
			return coverUrl ? (
				<img
					src={coverUrl}
					alt="Capa"
					className="h-12 w-8 object-cover rounded-sm border border-border"
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
		accessorKey: 'author', // Adicionamos o autor aqui
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
		cell: ({ row }) => {
			const manga = row.original

			return (
				<div className="flex items-center gap-2">
					{/* O link dinâmico para os volumes continua firme e forte! */}
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

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-primary"
					>
						<Edit className="h-4 w-4" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-destructive hover:bg-destructive/10"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			)
		},
	},
]
