'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Save, ArrowLeft, FileImage, X } from 'lucide-react'

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

export default function NewChapterPage({
	params,
}: {
	params: Promise<{ mangaId: string; volumeId: string }>
}) {
	const router = useRouter()

	const resolvedParams = React.use(params)
	const volumeId = Number(resolvedParams.volumeId)
	const mangaId = Number(resolvedParams.mangaId)

	const [chapterNumber, setChapterNumber] = React.useState('')
	const [title, setTitle] = React.useState('')

	// Aqui guardamos um array de arquivos em vez de um só!
	const [pagesFiles, setPagesFiles] = React.useState<File[]>([])
	const [isLoading, setIsLoading] = React.useState(false)

	// Função para remover uma página específica do preview caso o usuário tenha selecionado errado
	const removeFile = (indexToRemove: number) => {
		setPagesFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Step 1: Criar o Capítulo no banco de dados
			const chapterRes = await fetch('http://localhost:3333/chapters', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					volumeId,
					chapterNumber: Number(chapterNumber),
					title: title ? title : undefined,
					pages: [],
				}),
			})

			if (!chapterRes.ok) {
				const errorText = await chapterRes.text()
				throw new Error(`Erro ao criar capítulo: ${errorText}`)
			}
			const newChapter = await chapterRes.json()

			// Step 2: Fazer o Upload Lote das Páginas!
			if (pagesFiles.length > 0 && newChapter.id) {
				const formData = new FormData()

				pagesFiles.forEach((file) => {
					formData.append('pages', file)
				})

				const uploadRes = await fetch(
					`http://localhost:3333/chapters/${newChapter.id}/pages`,
					{
						method: 'PATCH',
						body: formData,
					}
				)

				// ROLLBACK
				if (!uploadRes.ok) {
					// Se a AWS falhou, nós imediatamente deletamos o capítulo "vazio" que acabou de ser criado!
					console.log(
						'Falha na AWS detectada. Executando Rollback (Deletando capítulo fantasma)...'
					)
					await fetch(`http://localhost:3333/chapters/${newChapter.id}`, {
						method: 'DELETE',
					})

					throw new Error(
						'Falha no upload para a AWS. A operação foi cancelada e o banco de dados foi limpo.'
					)
				}
			}

			router.push(`/mangas/${mangaId}/volumes/${volumeId}/chapters`)
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
						<div className="flex items-center gap-4 mb-4">
							<Button variant="outline" size="icon" onClick={() => router.back()}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
							<div className="flex-1">
								<h1 className="text-2xl font-bold tracking-tight">Novo Capítulo</h1>
								<p className="text-muted-foreground text-sm">
									Faça o upload das páginas desta edição.
								</p>
							</div>
						</div>

						<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
							<Card>
								<CardHeader>
									<CardTitle>Imagens do Capítulo</CardTitle>
									<CardDescription>
										Selecione todas as páginas de uma vez. A ordem de seleção
										será a ordem de leitura.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Área de Seleção de Arquivos */}
									<div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 bg-muted/10 hover:bg-muted/20 transition-colors">
										<div className="flex flex-col items-center gap-2 mb-4">
											<div className="p-4 bg-primary/10 text-primary rounded-full">
												<Upload className="h-8 w-8" />
											</div>
											<h3 className="font-semibold text-lg">
												Selecione Múltiplas Páginas
											</h3>
											<p className="text-sm text-muted-foreground">
												Arraste ou clique abaixo (Max: 100 páginas)
											</p>
										</div>

										<Label
											htmlFor="pages-upload"
											className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 rounded-md font-medium"
										>
											Procurar Arquivos
										</Label>

										{/* A mágica do atributo "multiple" acontece aqui */}
										<input
											id="pages-upload"
											type="file"
											accept="image/*"
											multiple
											className="hidden"
											onChange={(e) => {
												if (e.target.files) {
													// Converte a FileList para um Array comum do JS
													const newFiles = Array.from(e.target.files)
													setPagesFiles((prev) => [...prev, ...newFiles])
												}
											}}
										/>
									</div>

									{/* Grid de Preview das Páginas Selecionadas */}
									{pagesFiles.length > 0 && (
										<div className="space-y-3">
											<div className="flex items-center justify-between text-sm">
												<span className="font-medium text-muted-foreground">
													{pagesFiles.length} páginas selecionadas
												</span>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setPagesFiles([])}
													className="h-8 text-destructive"
												>
													Limpar tudo
												</Button>
											</div>

											<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
												{pagesFiles.map((file, index) => (
													<div
														key={`${file.name}-${index}`}
														className="relative group aspect-[2/3] rounded-md overflow-hidden bg-muted border border-border"
													>
														<img
															src={URL.createObjectURL(file)}
															alt={`Página ${index + 1}`}
															className="object-cover w-full h-full"
														/>
														{/* Overlay de numeração */}
														<div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold">
															{index + 1}
														</div>
														{/* Overlay de exclusão */}
														<div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
															<Button
																variant="destructive"
																size="icon"
																className="h-8 w-8 rounded-full"
																onClick={() => removeFile(index)}
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Coluna Lateral: Dados e Botão Salvar */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Detalhes</CardTitle>
									</CardHeader>
									<CardContent>
										<form
											id="chapter-form"
											onSubmit={handleSubmit}
											className="space-y-4"
										>
											<div className="space-y-2">
												<Label htmlFor="chapterNumber">
													Número do Capítulo
												</Label>
												<Input
													id="chapterNumber"
													type="number"
													placeholder="Ex: 1"
													required
													min="0"
													step="0.1" // Permite capítulos como 1.5
													value={chapterNumber}
													onChange={(e) =>
														setChapterNumber(e.target.value)
													}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="title">
													Título do Capítulo (Opcional)
												</Label>
												<Input
													id="title"
													placeholder="Ex: A Chegada"
													value={title}
													onChange={(e) => setTitle(e.target.value)}
												/>
											</div>
										</form>
									</CardContent>
								</Card>

								<Button
									type="submit"
									form="chapter-form"
									className="w-full h-12 text-md font-bold"
									disabled={isLoading || pagesFiles.length === 0}
								>
									{isLoading ? (
										'Enviando Páginas...'
									) : (
										<>
											<Save className="mr-2 h-5 w-5" /> Publicar Capítulo
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
