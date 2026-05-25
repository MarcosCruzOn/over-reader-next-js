'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Save, ArrowLeft, Layers, Upload, BookImage, Loader2 } from 'lucide-react'

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

export default function EditVolumePage() {
	const router = useRouter()
	const params = useParams()

	const mangaId = Number(params.mangaId)
	const volumeId = Number(params.volumeId) // O nome da pasta é [volumeId]

	const [isFetching, setIsFetching] = React.useState(true)
	const [isLoading, setIsLoading] = React.useState(false)

	// Estados do Formulário
	const [volumeNumber, setVolumeNumber] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [coverFile, setCoverFile] = React.useState<File | null>(null)
	const [existingCover, setExistingCover] = React.useState<string | null>(null)

	// Busca os dados atuais do Volume
	React.useEffect(() => {
		fetch(`http://localhost:3333/volumes/${volumeId}`)
			.then((res) => {
				if (!res.ok) throw new Error('Falha ao buscar volume')
				return res.json()
			})
			.then((data) => {
				setVolumeNumber(data.volumeNumber.toString())
				setTitle(data.title || '')
				setExistingCover(data.coverUrl)
				setIsFetching(false)
			})
			.catch((err) => {
				console.error(err)
				alert('Erro ao carregar o volume.')
				router.push(`/mangas/${mangaId}/volumes`)
			})
	}, [volumeId, mangaId, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Step 1: Atualiza os dados de texto (PUT)
			const res = await fetch(`http://localhost:3333/volumes/${volumeId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					volumeNumber: Number(volumeNumber),
					title: title ? title : null,
				}),
			})

			if (!res.ok) throw new Error('Erro ao atualizar dados do volume.')

			// Step 2: Atualiza a Capa APENAS se o usuário selecionou uma nova
			if (coverFile) {
				const formData = new FormData()
				formData.append('cover', coverFile)

				const uploadRes = await fetch(`http://localhost:3333/volumes/${volumeId}/cover`, {
					method: 'PATCH',
					body: formData,
				})

				if (!uploadRes.ok) throw new Error('Textos salvos, mas falhou ao enviar nova capa.')
			}

			alert('Volume atualizado com sucesso!')
			router.push(`/mangas/${mangaId}/volumes`)
			router.refresh()
		} catch (error) {
			console.error(error)
			alert(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.')
		} finally {
			setIsLoading(false)
		}
	}

	if (isFetching) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		)
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
						<div className="flex items-center gap-4 mb-4">
							<Button variant="outline" size="icon" onClick={() => router.back()}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
							<div className="flex-1">
								<h1 className="text-2xl font-bold tracking-tight">Editar Volume</h1>
								<p className="text-muted-foreground text-sm">
									Atualize as informações ou a capa desta edição.
								</p>
							</div>
						</div>

						<form
							onSubmit={handleSubmit}
							className="grid gap-6 lg:grid-cols-[1fr_400px]"
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Layers className="h-5 w-5 text-primary" />
										Detalhes do Volume
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="volumeNumber">Número do Volume</Label>
											<Input
												id="volumeNumber"
												type="number"
												required
												min="1"
												value={volumeNumber}
												onChange={(e) => setVolumeNumber(e.target.value)}
											/>
										</div>
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
								</CardContent>
							</Card>

							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Capa do Volume</CardTitle>
										<CardDescription>
											Envie nova imagem apenas se quiser substituir.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
											{/* Lógica de Preview de Imagem */}
											{coverFile ? (
												<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted">
													<Image
														src={URL.createObjectURL(coverFile)}
														className="object-cover w-full h-full"
														alt="Capa do volume"
														loading="lazy"
													/>
												</div>
											) : existingCover ? (
												<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted opacity-80 hover:opacity-100 transition-opacity">
													<Image
														src={existingCover}
														alt="Capa Atual"
														className="object-cover w-full h-full"
													/>
													<div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
														Capa Atual
													</div>
												</div>
											) : (
												<div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8">
													<BookImage className="h-12 w-12 opacity-50" />
													<span className="text-sm font-medium text-center">
														Nenhuma capa
														<br />
														cadastrada
													</span>
												</div>
											)}

											<Label
												htmlFor="cover-upload"
												className="cursor-pointer flex items-center justify-center w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
											>
												<Upload className="h-4 w-4" />
												{coverFile
													? 'Trocar Nova Capa'
													: 'Selecionar Nova Capa'}
											</Label>
											<input
												id="cover-upload"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) =>
													setCoverFile(e.target.files?.[0] || null)
												}
											/>
										</div>
									</CardContent>
								</Card>

								<Button
									type="submit"
									className="w-full h-12 text-md font-bold"
									disabled={isLoading}
								>
									{isLoading ? (
										'Salvando...'
									) : (
										<>
											<Save className="mr-2 h-5 w-5" /> Atualizar Volume
										</>
									)}
								</Button>
							</div>
						</form>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
