import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

import { DataTable } from '@workspace/ui/components/data-table'
import { Button } from '@workspace/ui/components/button'

import { columns } from './columns'

// Função para buscar os capítulos do backend
async function getChapters(volumeId: string) {
	try {
		const res = await fetch(`http://localhost:3333/chapters/volume/${volumeId}`, {
			cache: 'no-store',
		})
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`Erro ${res.status}: ${errorText}`)
		}
		return await res.json()
	} catch (error) {
		console.error('Erro ao buscar capítulos:', error)
		return []
	}
}

export default async function ChaptersPage({
	params,
}: {
	params: Promise<{ mangaId: string; volumeId: string }>
}) {
	// Desempacotando a Promise dos parâmetros (Next.js 15+)
	const resolvedParams = await params
	const { mangaId, volumeId } = resolvedParams

	const chapters = await getChapters(volumeId)

	return (
		<>
			{/* Cabeçalho */}
			<div className="flex items-center gap-4 mb-4">
				{/* Botão de voltar (volta para os volumes daquele mangá) */}
				<Link href={`/mangas/${mangaId}/volumes`}>
					<Button variant="outline" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">Gerenciar Capítulos</h1>
					<p className="text-muted-foreground text-sm">
						Organize as páginas lidas pelos usuários.
					</p>
				</div>

				{/* Botão para adicionar um novo capítulo (Upload Múltiplo!) */}
				<Link href={`/mangas/${mangaId}/volumes/${volumeId}/chapters/new`}>
					<Button className="font-bold">
						<Plus className="mr-2 h-4 w-4" /> Adicionar Capítulo
					</Button>
				</Link>
			</div>

			{/* Tabela de Capítulos */}
			<div className="bg-card rounded-xl border border-border p-4">
				<DataTable columns={columns} data={chapters} />
			</div>
		</>
	)
}
