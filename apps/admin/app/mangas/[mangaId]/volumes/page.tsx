import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { DataTable } from '@workspace/ui/components/data-table'
import { Button } from '@workspace/ui/components/button'

import { columns } from './columns'

// Função para buscar os volumes do backend usando o mangaId da URL
async function getVolumes(mangaId: string) {
	try {
		const res = await fetch(`http://localhost:3333/volumes/manga/${mangaId}`, {
			cache: 'no-store',
		})

		// 🔥 O Fofoqueiro: Se der erro, ele lê o texto inteiro do backend antes de quebrar
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`Backend retornou Status ${res.status}: ${errorText}`)
		}

		return await res.json()
	} catch (error) {
		console.error('Erro completo da requisição:', error)
		return []
	}
}

// O Next.js injeta o "params" contendo o mangaId da URL
// 1. Atualizamos a tipagem para indicar que params é uma Promise
export default async function VolumesPage({ params }: { params: Promise<{ mangaId: string }> }) {
	// 2. Agora nós aguardamos a Promise ser resolvida antes de pegar o ID!
	const resolvedParams = await params

	// 3. E passamos o ID real (e não mais undefined) para o fetch
	const volumes = await getVolumes(resolvedParams.mangaId)

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
						{/* Cabeçalho */}
						<div className="flex items-center gap-4 mb-4">
							{/* Botão de voltar para a lista de mangás */}
							<Link href="/mangas">
								<Button variant="outline" size="icon">
									<ArrowLeft className="h-4 w-4" />
								</Button>
							</Link>
							<div className="flex-1">
								<h1 className="text-2xl font-bold tracking-tight">
									Gerenciar Volumes
								</h1>
								<p className="text-muted-foreground text-sm">
									Organize as edições desta obra.
								</p>
							</div>

							{/* Botão para adicionar um novo volume (vamos criar essa página depois!) */}
							<Link href={`/mangas/${resolvedParams.mangaId}/volumes/new`}>
								<Button className="font-bold">
									<Plus className="mr-2 h-4 w-4" /> Adicionar Volume
								</Button>
							</Link>
						</div>

						{/* Tabela de Volumes */}
						<div className="bg-card rounded-xl border border-border p-4">
							<DataTable columns={columns} data={volumes} />
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
