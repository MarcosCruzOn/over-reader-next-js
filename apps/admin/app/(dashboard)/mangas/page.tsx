import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DataTable } from '@workspace/ui/components/data-table'
import { Button } from '@workspace/ui/components/button'
import { columns } from './columns'

import { api } from '@/lib/api'

async function getMangas() {
	try {
		return await api.getMangas()
	} catch (error) {
		console.error(error)
		return []
	}
}

export default async function MangasPage() {
	const mangas = await getMangas()

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
			{/* Cabeçalho da Lista */}
			<div className="flex items-center justify-between mb-4 ">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Catálogo de Mangás</h1>
					<p className="text-muted-foreground text-sm">
						Gerencie todas as obras da plataforma.
					</p>
				</div>

				<Link href="/mangas/new">
					<Button className="font-bold">
						<Plus className="mr-2 h-4 w-4" /> Adicionar Mangá
					</Button>
				</Link>
			</div>

			{/* A nossa Tabela Genérica */}
			<div className="bg-card rounded-xl border border-border p-4 shadow-sm">
				<DataTable columns={columns} data={mangas} />
			</div>
		</div>
	)
}
