'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

export type Chapter = {
	id: number
	volumeId: number
	chapterNumber: number
	title: string | null
	pages: string[] // Array de URLs das imagens
}

export const columns: ColumnDef<Chapter>[] = [
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
			// Como pages é um JSON array, podemos ver o tamanho (length) dele
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
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
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
