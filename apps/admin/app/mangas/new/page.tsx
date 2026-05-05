'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Save, ArrowLeft, BookImage } from 'lucide-react'

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

export default function NewMangaPage() {
	const router = useRouter()

	// Estados do nosso formulário
	const [title, setTitle] = React.useState('')
	const [synopsis, setSynopsis] = React.useState('')
	const [status, setStatus] = React.useState('Em andamento')
	const [coverFile, setCoverFile] = React.useState<File | null>(null)
	const [isLoading, setIsLoading] = React.useState(false)

	// O "Chefão": Função que lida com o envio para o Backend + AWS S3
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Step 1: Cria o Mangá (Apenas os dados de texto)
			const mangaRes = await fetch('http://localhost:3333/mangas', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					synopsis,
					status,
				}),
			})

			if (!mangaRes.ok) throw new Error('Falha ao criar os dados do mangá.')
			const newManga = await mangaRes.json()

			// Step 2: Se o usuário selecionou uma capa, fazemos o Upload!
			if (coverFile && newManga.id) {
				// FormData é o padrão da web para enviar arquivos (multipart/form-data)
				const formData = new FormData()
				formData.append('cover', coverFile) // O nome 'cover' deve bater com o nome no multer do backend

				const uploadRes = await fetch(`http://localhost:3333/mangas/${newManga.id}/cover`, {
					method: 'PATCH',
					body: formData,
					// Importante: NÃO defina o Content-Type manualmente aqui.
					// O navegador calcula o "boundary" automaticamente quando usamos FormData!
				})

				if (!uploadRes.ok) throw new Error('Mangá criado, mas falhou ao enviar a capa.')
			}

			// Sucesso! Volta para a página inicial do Dashboard
			router.push('/')
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
							<h1 className="text-2xl font-bold tracking-tight">
								Adicionar Novo Mangá
							</h1>
						</div>

						<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
							{/* Coluna Principal: Formulário */}
							<Card>
								<CardHeader>
									<CardTitle>Informações do Mangá</CardTitle>
									<CardDescription>
										Preencha os dados básicos da obra.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form
										id="manga-form"
										onSubmit={handleSubmit}
										className="space-y-6"
									>
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

										<div className="space-y-2">
											<Label htmlFor="synopsis">Sinopse (Opcional)</Label>
											{/* Usando uma textarea HTML padronizada com as classes do Input do shadcn */}
											<textarea
												id="synopsis"
												placeholder="Uma breve descrição da história..."
												className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												value={synopsis}
												onChange={(e) => setSynopsis(e.target.value)}
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="status">Status de Publicação</Label>
											<Select value={status} onValueChange={setStatus}>
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

							{/* Coluna Lateral: Upload da Capa & Ações */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Capa do Mangá</CardTitle>
										<CardDescription>
											Imagem que será exibida para os leitores.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
											{/* Preview da Imagem ou Ícone Padrão */}
											{coverFile ? (
												<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted">
													{/* Usamos URL.createObjectURL para mostrar a imagem antes de enviar pro servidor! */}
													<img
														src={URL.createObjectURL(coverFile)}
														alt="Preview da Capa"
														className="object-cover w-full h-full"
													/>
												</div>
											) : (
												<div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8">
													<BookImage className="h-12 w-12 opacity-50" />
													<span className="text-sm font-medium">
														Nenhuma capa selecionada
													</span>
												</div>
											)}

											<Label
												htmlFor="cover-upload"
												className="cursor-pointer flex items-center justify-center w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
											>
												<Upload className="h-4 w-4" />
												{coverFile ? 'Trocar Imagem' : 'Selecionar Arquivo'}
											</Label>

											{/* Input de arquivo invisível (escondido pelo label acima) */}
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
											<p className="text-xs text-muted-foreground text-center">
												Recomendado: PNG, JPG ou WebP.
												<br />
												Máx: 5MB.
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Botão de Salvar Global */}
								<Button
									type="submit"
									form="manga-form" // O form="id" liga este botão ao formulário da outra coluna!
									className="w-full h-12 text-md font-bold"
									disabled={isLoading}
								>
									{isLoading ? (
										'Salvando na Nuvem...'
									) : (
										<>
											<Save className="mr-2 h-5 w-5" /> Publicar Mangá
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
