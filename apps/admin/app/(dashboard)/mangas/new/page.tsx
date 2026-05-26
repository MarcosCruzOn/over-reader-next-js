'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Save, ArrowLeft, BookImage, Image as ImageIcon } from 'lucide-react'

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

export default function NewMangaPage() {
	const router = useRouter()

	// Estados de texto
	const [title, setTitle] = React.useState('')
	const [author, setAuthor] = React.useState('')
	const [genres, setGenres] = React.useState('')
	const [synopsis, setSynopsis] = React.useState('')
	const [status, setStatus] = React.useState('Em andamento')
	const [releaseYear, setReleaseYear] = React.useState('')
	const [publisher, setPublisher] = React.useState('')

	// Estados de Imagem
	const [coverFile, setCoverFile] = React.useState<File | null>(null)
	const [bannerFile, setBannerFile] = React.useState<File | null>(null)

	const [isLoading, setIsLoading] = React.useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// 🛡️ BARREIRA DE PROTEÇÃO NO FRONTEND
		if (!coverFile) return alert('A Capa do mangá é OBRIGATÓRIA!')
		if (!bannerFile) return alert('O Banner do mangá é OBRIGATÓRIO!')

		const year = Number(releaseYear)
		if (year < 0) return alert('O Ano de Lançamento não pode ser negativo.')

		setIsLoading(true)

		try {
			// Step 1: Cria o Mangá no banco de dados
			const mangaRes = await fetch('http://localhost:3333/mangas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					author,
					genres,
					synopsis,
					status,
					releaseYear: year, // Agora garantimos que é um número válido e obrigatório
					publisher,
				}),
			})

			if (!mangaRes.ok) {
				const errorData = await mangaRes.json().catch(() => ({}))
				throw new Error(errorData.error || `Erro no servidor: Status ${mangaRes.status}`)
			}

			const newManga = await mangaRes.json()

			// Step 2: O Upload Duplo (Capa e Banner ao mesmo tempo na AWS)
			if (newManga.id) {
				const coverData = new FormData()
				coverData.append('cover', coverFile)

				const bannerData = new FormData()
				bannerData.append('banner', bannerFile)

				// Disparamos as duas requisições simultaneamente com Promise.all
				const [coverRes, bannerRes] = await Promise.all([
					fetch(`http://localhost:3333/mangas/${newManga.id}/cover`, {
						method: 'PATCH',
						body: coverData,
					}),
					fetch(`http://localhost:3333/mangas/${newManga.id}/banner`, {
						method: 'PATCH',
						body: bannerData,
					}),
				])

				if (!coverRes.ok || !bannerRes.ok) {
					throw new Error(
						'Mangá criado, mas falhou ao enviar uma das imagens para a AWS.'
					)
				}
			}

			router.push('/mangas')
			router.refresh()
		} catch (error) {
			console.error(error)
			alert(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<div className="flex items-center gap-4 mb-4">
				<Button variant="outline" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Adicionar Novo Mangá</h1>
					<p className="text-sm text-muted-foreground">
						Preencha todos os dados para catalogar a obra.
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
				{/* COLUNA PRINCIPAL: Textos e Banner */}
				<div className="space-y-6">
					{/* NOVO CARD: Upload do Banner */}
					<Card>
						<CardHeader>
							<CardTitle>Banner do Mangá</CardTitle>
							<CardDescription>
								Imagem larga que aparecerá no topo da página de detalhes.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
								{bannerFile ? (
									<div className="relative w-full aspect-[21/9] rounded-md overflow-hidden bg-muted">
										{/* 🔥 Pré-visualização com img nativa */}
										<img
											src={URL.createObjectURL(bannerFile)}
											alt="Preview do Banner"
											className="object-cover w-full h-full"
											loading="eager"
										/>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 py-12">
										<ImageIcon className="h-12 w-12 opacity-50" />
										<span className="text-sm font-medium">
											Nenhum banner selecionado
										</span>
									</div>
								)}

								<Label
									htmlFor="banner-upload"
									className="cursor-pointer flex items-center justify-center w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
								>
									<Upload className="h-4 w-4" />
									{bannerFile ? 'Trocar Banner' : 'Selecionar Banner'}
								</Label>

								<input
									id="banner-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											setBannerFile(e.target.files[0])
										}
									}}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Informações Básicas</CardTitle>
						</CardHeader>
						<CardContent>
							<form id="manga-form" onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="title">Título do Mangá</Label>
									<Input
										id="title"
										placeholder="Ex: Solo Leveling"
										required
										value={title}
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="author">Autor / Desenhista</Label>
										<Input
											id="author"
											placeholder="Ex: Chugong, DUBU"
											required
											value={author}
											onChange={(e) => setAuthor(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="genres">Gêneros</Label>
										<Input
											id="genres"
											placeholder="Ex: Ação, Fantasia, Shounen"
											required
											value={genres}
											onChange={(e) => setGenres(e.target.value)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="releaseYear">Ano de Lançamento</Label>
										<Input
											id="releaseYear"
											type="number"
											min="0"
											required
											placeholder="Ex: 2018"
											value={releaseYear}
											onChange={(e) => setReleaseYear(e.target.value)}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="publisher">Editora / Revista</Label>
										<Input
											id="publisher"
											required
											placeholder="Ex: D&C Media"
											value={publisher}
											onChange={(e) => setPublisher(e.target.value)}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="synopsis">Sinopse</Label>
									<textarea
										id="synopsis"
										required
										placeholder="Uma breve descrição da história..."
										className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										value={synopsis}
										onChange={(e) => setSynopsis(e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status de Publicação</Label>
									{/* 🔥 ERRO DO TYPESCRIPT CORRIGIDO AQUI! */}
									<Select
										value={status}
										onValueChange={(val) => {
											if (val) setStatus(val)
										}}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o status" />
										</SelectTrigger>
										<SelectContent className="rounded-xl">
											<SelectItem value="Em andamento" className="rounded-lg">
												Em andamento
											</SelectItem>
											<SelectItem value="Concluído" className="rounded-lg">
												Concluído
											</SelectItem>
											<SelectItem value="Cancelado" className="rounded-lg">
												Cancelado
											</SelectItem>
											<SelectItem value="Hiato" className="rounded-lg">
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
							<CardDescription>Visualização vertical (2:3).</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
								{coverFile ? (
									<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted">
										{/* 🔥 Pré-visualização com img nativa */}
										<img
											src={URL.createObjectURL(coverFile)}
											alt="Preview da Capa"
											className="object-cover w-full h-full"
											loading="lazy"
										/>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8">
										<BookImage className="h-12 w-12 opacity-50" />
										<span className="text-sm font-medium text-center">
											Nenhuma capa
											<br />
											selecionada
										</span>
									</div>
								)}

								<Label
									htmlFor="cover-upload"
									className="cursor-pointer flex items-center justify-center w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
								>
									<Upload className="h-4 w-4" />
									{coverFile ? 'Trocar Capa' : 'Selecionar Capa'}
								</Label>

								<input
									id="cover-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										if (e.target.files && e.target.files[0]) {
											setCoverFile(e.target.files[0])
										}
									}}
								/>
							</div>
						</CardContent>
					</Card>

					<Button
						type="submit"
						form="manga-form"
						className="w-full h-12 text-md font-bold"
						disabled={isLoading}
					>
						{isLoading ? (
							'Processando Uploads...'
						) : (
							<>
								<Save className="mr-2 h-5 w-5" /> Cadastrar Obra Completa
							</>
						)}
					</Button>
				</div>
			</div>
		</>
	)
}
