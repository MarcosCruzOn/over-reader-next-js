'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // <-- Importação que faltava!
import { Plus, ArrowLeft, LayoutGrid, List, Edit, Trash2 } from 'lucide-react'

import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { DataTable } from '@workspace/ui/components/data-table'
import { Button } from '@workspace/ui/components/button'

import { columns } from './columns'

export default function VolumesPage({ params }: { params: Promise<{ mangaId: string }> }) {
	const router = useRouter() // <-- Inicialização do Router para o refresh funcionar
	const resolvedParams = React.use(params)
	const mangaId = resolvedParams.mangaId

	// Estados
	const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('grid')
	const [manga, setManga] = React.useState<any>(null)
	const [volumes, setVolumes] = React.useState<any[]>([])

	React.useEffect(() => {
		Promise.all([
			fetch(`http://localhost:3333/mangas/${mangaId}`).then((res) => {
				if (!res.ok) return null
				return res.json()
			}),
			fetch(`http://localhost:3333/volumes/manga/${mangaId}`).then((res) => {
				if (!res.ok) return []
				return res.json()
			}),
		])
			.then(([mangaData, volumesData]) => {
				setManga(mangaData)
				setVolumes(volumesData)
			})
			.catch((error) => {
				console.error('Erro ao carregar dados:', error)
			})
	}, [mangaId])

	const handleDeleteVolume = async (id: number) => {
		if (
			!window.confirm(
				'Tem certeza que deseja apagar este volume? Todos os capítulos serão perdidos!'
			)
		) {
			return
		}

		try {
			const res = await fetch(`http://localhost:3333/volumes/${id}`, { method: 'DELETE' })
			if (res.ok) {
				// Remove o volume da tela instantaneamente
				setVolumes((prev) => prev.filter((vol) => vol.id !== id))
				router.refresh()
			} else {
				alert('Erro ao apagar volume do banco de dados.')
			}
		} catch (error) {
			console.error(error)
			alert('Falha na comunicação com o servidor.')
		}
	}

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
						{/* CABEÇALHO E BOTÃO DE VOLTAR */}
						<div className="flex items-center gap-4 mb-4">
							<Link href="/mangas">
								<Button variant="outline" size="icon">
									<ArrowLeft className="h-4 w-4" />
								</Button>
							</Link>
							<div className="flex-1">
								<h1 className="text-2xl font-bold tracking-tight">
									{manga
										? `Gerenciar Volumes: ${manga.title}`
										: 'Gerenciar Volumes'}
								</h1>
								<p className="text-muted-foreground text-sm">
									Organize as edições desta obra.
								</p>
							</div>
						</div>

						{/* BANNER DO MANGÁ */}
						{manga && manga.bannerUrl ? (
							<div className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative mb-6">
								<img
									src={manga.bannerUrl}
									alt={manga.title}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
									<h1 className="text-3xl font-bold text-white">{manga.title}</h1>
								</div>
							</div>
						) : (
							<div className="w-full h-32 rounded-xl bg-muted flex items-center justify-center mb-6 border-2 border-dashed border-border">
								<span className="text-muted-foreground font-medium">
									Este mangá é antigo e não possui um banner cadastrado.
								</span>
							</div>
						)}

						{/* Controles de Visualização */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex gap-2">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									size="icon"
									onClick={() => setViewMode('grid')}
								>
									<LayoutGrid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'table' ? 'default' : 'outline'}
									size="icon"
									onClick={() => setViewMode('table')}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>

							<Link href={`/mangas/${mangaId}/volumes/new`}>
								<Button className="font-bold">
									<Plus className="mr-2 h-4 w-4" /> Adicionar Volume
								</Button>
							</Link>
						</div>

						{/* RENDERIZAÇÃO CONDICIONAL: Grid vs Tabela */}
						{viewMode === 'table' ? (
							<div className="bg-card rounded-xl border p-4">
								<DataTable columns={columns} data={volumes} />
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
								{volumes.map((vol) => (
									<div
										key={vol.id}
										className="group relative rounded-lg border overflow-hidden bg-card hover:border-primary transition-all flex flex-col"
									>
										<div className="aspect-[2/3] bg-muted w-full">
											{vol.coverUrl ? (
												<img
													src={vol.coverUrl}
													className="w-full h-full object-cover"
													loading="eager"
												/>
											) : (
												<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
													Sem Capa
												</div>
											)}
										</div>
										<div className="p-4 flex flex-col flex-1 justify-between">
											<div>
												<h3 className="font-bold text-lg">
													Volume {vol.volumeNumber}
												</h3>
												<p className="text-sm text-muted-foreground truncate mb-4">
													{vol.title || 'S/ Título'}
												</p>
											</div>

											{/* BOTÕES DO GRID (Capítulos, Editar, Excluir) */}
											<div className="flex items-center gap-2 mt-auto">
												<Link
													href={`/mangas/${mangaId}/volumes/${vol.id}/chapters`}
													className="flex-1"
												>
													<Button
														className="w-full font-semibold"
														size="sm"
													>
														Capítulos
													</Button>
												</Link>

												<Link
													href={`/mangas/${mangaId}/volumes/${vol.id}/edit`}
												>
													<Button
														variant="outline"
														size="icon"
														className="h-9 w-9 text-muted-foreground hover:text-primary"
													>
														<Edit className="h-4 w-4" />
													</Button>
												</Link>

												<Button
													variant="outline"
													size="icon"
													className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
													onClick={() => handleDeleteVolume(vol.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
