'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, Save, ArrowLeft, BookImage, Image as ImageIcon, Loader2 } from 'lucide-react'

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select'

export default function EditMangaPage({ params }: { params: Promise<{ mangaId: string }> }) {
	const router = useRouter()
	const resolvedParams = React.use(params)
	const mangaId = Number(resolvedParams.mangaId)

	const [isFetching, setIsFetching] = React.useState(true)
	const [isLoading, setIsLoading] = React.useState(false)

	// Estados de texto
	const [title, setTitle] = React.useState('')
	const [author, setAuthor] = React.useState('')
	const [genres, setGenres] = React.useState('')
	const [synopsis, setSynopsis] = React.useState('')
	const [status, setStatus] = React.useState('Em andamento')
	const [releaseYear, setReleaseYear] = React.useState('')
	const [publisher, setPublisher] = React.useState('')

	// Estados de Imagem (Arquivos novos e URLs antigas)
	const [coverFile, setCoverFile] = React.useState<File | null>(null)
	const [bannerFile, setBannerFile] = React.useState<File | null>(null)
	const [existingCover, setExistingCover] = React.useState<string | null>(null)
	const [existingBanner, setExistingBanner] = React.useState<string | null>(null)

	// Busca os dados antigos do mangá para preencher o formulário
	React.useEffect(() => {
		fetch(`http://localhost:3333/mangas/${mangaId}`)
			.then((res) => {
				if (!res.ok) throw new Error('Falha ao buscar os dados do mangá')
				return res.json()
			})
			.then((data) => {
				setTitle(data.title)
				setAuthor(data.author)
				setGenres(data.genres)
				setSynopsis(data.synopsis)
				setStatus(data.status)
				setReleaseYear(data.releaseYear.toString())
				setPublisher(data.publisher || '')
				setExistingCover(data.coverUrl)
				setExistingBanner(data.bannerUrl)
				setIsFetching(false)
			})
			.catch((err) => {
				console.error(err)
				alert('Erro ao carregar o mangá.')
				router.push('/mangas')
			})
	}, [mangaId, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const year = Number(releaseYear)
		if (year < 0) return alert('O Ano de Lançamento não pode ser negativo.')

		setIsLoading(true)

		try {
			// Step 1: Atualiza os dados de texto (PUT)
			const mangaRes = await fetch(`http://localhost:3333/mangas/${mangaId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					author,
					genres,
					synopsis,
					status,
					releaseYear: year,
					publisher,
				}),
			})

			if (!mangaRes.ok) throw new Error('Falha ao atualizar os dados do mangá.')

			// Step 2: Atualiza as imagens separadamente, APENAS SE o usuário escolheu novas!
			const uploadPromises = []

			if (coverFile) {
				const coverData = new FormData()
				coverData.append('cover', coverFile)
				uploadPromises.push(
					fetch(`http://localhost:3333/mangas/${mangaId}/cover`, {
						method: 'PATCH',
						body: coverData,
					})
				)
			}

			if (bannerFile) {
				const bannerData = new FormData()
				bannerData.append('banner', bannerFile)
				uploadPromises.push(
					fetch(`http://localhost:3333/mangas/${mangaId}/banner`, {
						method: 'PATCH',
						body: bannerData,
					})
				)
			}

			if (uploadPromises.length > 0) {
				const results = await Promise.all(uploadPromises)
				const hasError = results.some((res) => !res.ok)
				if (hasError)
					throw new Error('Textos atualizados, mas falha no envio das novas imagens.')
			}

			alert('Mangá atualizado com sucesso!')
			router.push('/mangas')
			router.refresh() // Força a atualização da tabela
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
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Editar Mangá</h1>
								<p className="text-sm text-muted-foreground">
									Altere as informações ou atualize as imagens da obra.
								</p>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
							{/* COLUNA PRINCIPAL: Textos e Banner */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Banner do Mangá</CardTitle>
										<CardDescription>
											Envie uma nova imagem apenas se quiser substituir a
											atual.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
											{/* Lógica de Preview: Mostra a nova se selecionada, senão mostra a antiga, senão mostra ícone */}
											{bannerFile ? (
												<div className="relative w-full aspect-[21/9] rounded-md overflow-hidden bg-muted">
													<Image
														src={URL.createObjectURL(bannerFile)}
														alt="Novo Banner"
														className="object-cover w-full h-full"
														loading="lazy"
														fill
													/>
												</div>
											) : existingBanner ? (
												<div className="relative w-full aspect-[21/9] rounded-md overflow-hidden bg-muted opacity-80 hover:opacity-100 transition-opacity">
													<Image
														src={existingBanner}
														alt="Banner Atual"
														className="object-cover w-full h-full"
														loading="lazy"
														fill
													/>
													<div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
														Imagem Atual
													</div>
												</div>
											) : (
												<div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 py-12">
													<ImageIcon className="h-12 w-12 opacity-50" />
													<span className="text-sm font-medium">
														Nenhum banner cadastrado
													</span>
												</div>
											)}

											<Label
												htmlFor="banner-upload"
												className="cursor-pointer flex items-center justify-center w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
											>
												<Upload className="h-4 w-4" />
												Selecionar Novo Banner
											</Label>
											<input
												id="banner-upload"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) =>
													setBannerFile(e.target.files?.[0] || null)
												}
											/>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Informações Básicas</CardTitle>
									</CardHeader>
									<CardContent>
										<form
											id="edit-form"
											onSubmit={handleSubmit}
											className="space-y-6"
										>
											<div className="space-y-2">
												<Label htmlFor="title">Título do Mangá</Label>
												<Input
													id="title"
													required
													value={title}
													onChange={(e) => setTitle(e.target.value)}
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="author">
														Autor / Desenhista
													</Label>
													<Input
														id="author"
														required
														value={author}
														onChange={(e) => setAuthor(e.target.value)}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="genres">Gêneros</Label>
													<Input
														id="genres"
														required
														value={genres}
														onChange={(e) => setGenres(e.target.value)}
													/>
												</div>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="releaseYear">
														Ano de Lançamento
													</Label>
													<Input
														id="releaseYear"
														type="number"
														min="0"
														required
														value={releaseYear}
														onChange={(e) =>
															setReleaseYear(e.target.value)
														}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="publisher">
														Editora / Revista
													</Label>
													<Input
														id="publisher"
														required
														value={publisher}
														onChange={(e) =>
															setPublisher(e.target.value)
														}
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="synopsis">Sinopse</Label>
												<textarea
													id="synopsis"
													required
													className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
													value={synopsis}
													onChange={(e) => setSynopsis(e.target.value)}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="status">Status de Publicação</Label>
												<Select
													value={status}
													onValueChange={setStatus}
													required
												>
													<SelectTrigger>
														<SelectValue placeholder="Selecione o status" />
													</SelectTrigger>
													<SelectContent className="rounded-xl">
														<SelectItem
															value="Em andamento"
															className="rounded-lg"
														>
															Em andamento
														</SelectItem>
														<SelectItem
															value="Concluído"
															className="rounded-lg"
														>
															Concluído
														</SelectItem>
														<SelectItem
															value="Cancelado"
															className="rounded-lg"
														>
															Cancelado
														</SelectItem>
														<SelectItem
															value="Hiato"
															className="rounded-lg"
														>
															Em Hiato
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</form>
									</CardContent>
								</Card>
							</div>

							{/* COLUNA LATERAL: Capa e Botão Salvar */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Capa do Mangá</CardTitle>
										<CardDescription>
											Envie uma nova imagem apenas se quiser substituir.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
											{coverFile ? (
												<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted">
													<Image
														src={URL.createObjectURL(coverFile)}
														alt="Nova Capa"
														className="object-cover w-full h-full"
														loading="lazy"
														fill
													/>
												</div>
											) : existingCover ? (
												<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted opacity-80 hover:opacity-100 transition-opacity">
													<Image
														src={existingCover}
														alt="Capa Atual"
														className="object-cover w-full h-full"
														loading="lazy"
														fill
													/>
													<div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
														Imagem Atual
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
												Selecionar Nova Capa
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
									form="edit-form"
									className="w-full h-12 text-md font-bold"
									disabled={isLoading}
								>
									{isLoading ? (
										'Salvando Alterações...'
									) : (
										<>
											<Save className="mr-2 h-5 w-5" /> Atualizar Mangá
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
