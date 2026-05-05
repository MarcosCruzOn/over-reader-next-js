'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Layers, Edit, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

// Definimos o formato do Volume que vem do banco de dados
export type Volume = {
	id: number
	mangaId: number
	volumeNumber: number
	title: string | null
}

export const columns: ColumnDef<Volume>[] = [
	{
		accessorKey: 'volumeNumber',
		header: 'Volume',
		cell: ({ row }) => (
			<span className="font-bold text-lg">Vol. {row.getValue('volumeNumber')}</span>
		),
	},
	{
		accessorKey: 'title',
		header: 'Título / Arco',
		cell: ({ row }) => {
			const title = row.getValue('title') as string | null
			return title ? title : <span className="text-muted-foreground italic">Sem título</span>
		},
	},
	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => {
			const volume = row.original

			return (
				<div className="flex items-center gap-2">
					{/* Botão que nos levará para os CAPÍTULOS deste volume */}
					<Link href={`/mangas/${volume.mangaId}/volumes/${volume.id}/chapters`}>
						<Button
							variant="outline"
							size="sm"
							className="h-8 gap-1 border-primary/50 text-primary hover:bg-primary/10"
						>
							<Layers className="h-4 w-4" />
							<span>Capítulos</span>
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
