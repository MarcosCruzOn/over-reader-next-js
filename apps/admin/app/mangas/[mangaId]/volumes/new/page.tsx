'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Layers } from 'lucide-react'

import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

export default function NewVolumePage({ params }: { params: Promise<{ mangaId: string }> }) {
	const router = useRouter()

	// Desempacotando os params no Client Component do Next.js 15+
	const resolvedParams = React.use(params)
	const mangaId = Number(resolvedParams.mangaId)

	const [volumeNumber, setVolumeNumber] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Mandando os dados para a nossa rota de criação de Volumes
			const res = await fetch('http://localhost:3333/volumes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					mangaId,
					volumeNumber: Number(volumeNumber),
					title: title ? title : undefined,
				}),
			})

			if (!res.ok) {
				const errorText = await res.text()
				throw new Error(`Erro do servidor: ${errorText}`)
			}

			// Se deu certo, volta para a tabela de volumes e força um refresh nos dados
			router.push(`/mangas/${mangaId}/volumes`)
			router.refresh()
		} catch (error) {
			console.error(error)
			alert(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.')
		} finally {
			setIsLoading(false)
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
						{/* Cabeçalho da Página */}
						<div className="flex items-center gap-4 mb-4">
							<Button variant="outline" size="icon" onClick={() => router.back()}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
							<div className="flex-1">
								<h1 className="text-2xl font-bold tracking-tight">Novo Volume</h1>
								<p className="text-muted-foreground text-sm">
									Adicionando uma nova edição ao mangá.
								</p>
							</div>
						</div>

						<div className="max-w-2xl">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Layers className="h-5 w-5 text-primary" />
										Detalhes do Volume
									</CardTitle>
									<CardDescription>
										Defina a numeração e o título deste volume.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit} className="space-y-6">
										<div className="grid grid-cols-2 gap-4">
											{/* Campo: Número do Volume */}
											<div className="space-y-2">
												<Label htmlFor="volumeNumber">
													Número do Volume
												</Label>
												<Input
													id="volumeNumber"
													type="number"
													placeholder="Ex: 1"
													required
													min="1"
													value={volumeNumber}
													onChange={(e) =>
														setVolumeNumber(e.target.value)
													}
												/>
											</div>

											{/* Campo: Título (Opcional) */}
											<div className="space-y-2">
												<Label htmlFor="title">
													Título do Volume (Opcional)
												</Label>
												<Input
													id="title"
													placeholder="Ex: O Despertar"
													value={title}
													onChange={(e) => setTitle(e.target.value)}
												/>
											</div>
										</div>

										<Button
											type="submit"
											className="w-full h-12 text-md font-bold"
											disabled={isLoading}
										>
											{isLoading ? (
												'Salvando...'
											) : (
												<>
													<Save className="mr-2 h-5 w-5" /> Cadastrar
													Volume
												</>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
