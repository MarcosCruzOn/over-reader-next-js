'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Layers, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

// Atualizamos o tipo do Volume para incluir a capa e suportar a contagem de capítulos
export type Volume = {
	id: number
	mangaId: number
	volumeNumber: number
	title: string | null
	coverUrl: string | null
	chapters?: any[] // Array de capítulos (caso o backend retorne)
	chapterCount?: number // Ou apenas o número (caso o backend retorne a contagem)
}

// Criamos o Componente de Ações isolado para podermos usar o useRouter
const VolumeActionsCell = ({ volume }: { volume: Volume }) => {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = React.useState(false)

	const handleDelete = async () => {
		if (
			!window.confirm(
				`Tem certeza que deseja deletar o Volume ${volume.volumeNumber}? Todos os capítulos serão perdidos!`
			)
		) {
			return
		}

		setIsDeleting(true)
		try {
			const res = await fetch(`http://localhost:3333/volumes/${volume.id}`, {
				method: 'DELETE',
			})

			if (!res.ok) throw new Error('Falha ao deletar volume')

			// Atualiza a tabela magicamente sem dar F5
			router.refresh()
		} catch (error) {
			console.error(error)
			alert('Erro ao deletar o volume.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className="flex items-center gap-2">
			{/* Botão para acessar os Capítulos */}
			<Link href={`/mangas/${volume.mangaId}/volumes/${volume.id}/chapters`}>
				<Button
					variant="outline"
					size="sm"
					className="h-8 gap-1 border-primary/50 text-primary hover:bg-primary/10"
				>
					<Layers className="h-4 w-4" />
					<span>Abrir Capítulos</span>
				</Button>
			</Link>

			{/* Botão de Editar */}
			<Link href={`/mangas/${volume.mangaId}/volumes/${volume.id}/edit`}>
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

export const columns: ColumnDef<Volume>[] = [
	{
		id: 'cover',
		header: 'Capa',
		cell: ({ row }) => {
			const coverUrl = row.original.coverUrl
			return coverUrl ? (
				<Image
					src={coverUrl}
					alt={`Capa Volume ${row.original.volumeNumber}`}
					className="h-16 w-11 object-cover rounded-sm border border-border"
					loading="lazy"
				/>
			) : (
				<div className="h-16 w-11 bg-muted rounded-sm flex items-center justify-center border border-border">
					<ImageIcon className="h-4 w-4 text-muted-foreground" />
				</div>
			)
		},
	},
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
		id: 'chaptersCount',
		header: 'Capítulos',
		cell: ({ row }) => {
			// Preparamos o Frontend para ler a contagem de capítulos.
			// Nota: Para mostrar o número real, o Backend precisará enviar o 'chapterCount' ou o array 'chapters'.
			// Por enquanto, se não vier nada do backend, ele mostrará "0".
			const count =
				row.original.chapterCount ||
				(row.original.chapters ? row.original.chapters.length : 0)

			return (
				<div className="flex items-center gap-2 text-muted-foreground">
					<Layers className="h-4 w-4" />
					<span className="font-medium">
						{count} {count === 1 ? 'capítulo' : 'capítulos'}
					</span>
				</div>
			)
		},
	},
	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => <VolumeActionsCell volume={row.original} />,
	},
]
