import Link from 'next/link'
import { Plus } from 'lucide-react'

import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { DataTable } from '@workspace/ui/components/data-table'
import { Button } from '@workspace/ui/components/button'

import { columns } from './columns'

async function getMangas() {
	try {
		const res = await fetch('http://localhost:3333/mangas', { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar mangás')
		return await res.json()
	} catch (error) {
		console.error(error)
		return []
	}
}

export default async function MangasPage() {
	const mangas = await getMangas()

	return (
		<div className="dark min-h-screen bg-background text-foreground">
			<SidebarProvider
				style={
					{
						'--sidebar-width': 'calc(var(--spacing) * 72)',
						'--header-height': 'calc(var(--spacing) * 12)',
					} as React.CSSProperties
				}
			>
				<AppSidebar variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col gap-4 p-4 lg:p-8">
						{/* Cabeçalho da Lista */}
						<div className="flex items-center justify-between mb-4">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">
									Catálogo de Mangás
								</h1>
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

						{/* A nossa Tabela Genérica brilhando novamente! */}
						<div className="bg-card rounded-xl border border-border p-4">
							<DataTable columns={columns} data={mangas} />
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
