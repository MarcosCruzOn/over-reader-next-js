'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, BookOpen, Upload, Loader2, X } from 'lucide-react'

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

export default function EditChapterPage({
	params,
}: {
	params: Promise<{ mangaId: string; volumeId: string; chapterId: string }>
}) {
	const router = useRouter()
	const resolvedParams = React.use(params)

	const mangaId = resolvedParams.mangaId
	const volumeId = resolvedParams.volumeId
	const chapterId = resolvedParams.chapterId

	const [isFetching, setIsFetching] = React.useState(true)
	const [isLoading, setIsLoading] = React.useState(false)

	// Estados do Capítulo
	const [chapterNumber, setChapterNumber] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [existingPages, setExistingPages] = React.useState<string[]>([])
	const [newPagesFiles, setNewPagesFiles] = React.useState<File[]>([])

	// Busca dados atuais
	React.useEffect(() => {
		fetch(`http://localhost:3333/chapters/${chapterId}`)
			.then((res) => {
				if (!res.ok) throw new Error('Capítulo não encontrado')
				return res.json()
			})
			.then((data) => {
				setChapterNumber(data.chapterNumber.toString())
				setTitle(data.title || '')
				setExistingPages(data.pages || [])
				setIsFetching(false)
			})
			.catch((err) => {
				console.error(err)
				alert('Erro ao carregar capítulo.')
				router.back()
			})
	}, [chapterId, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Step 1: Atualizar textos (PUT)
			const res = await fetch(`http://localhost:3333/chapters/${chapterId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chapterNumber: Number(chapterNumber),
					title: title || null,
				}),
			})

			if (!res.ok) throw new Error('Erro ao atualizar dados do capítulo.')

			// Step 2: Se houver NOVAS páginas, faz o upload (PATCH)
			if (newPagesFiles.length > 0) {
				const formData = new FormData()
				newPagesFiles.forEach((file) => formData.append('pages', file))

				const uploadRes = await fetch(`http://localhost:3333/chapters/${chapterId}/pages`, {
					method: 'PATCH',
					body: formData,
				})

				if (!uploadRes.ok)
					throw new Error('Dados salvos, mas falha ao atualizar imagens na AWS.')
			}

			alert('Capítulo atualizado com sucesso!')
			router.push(`/mangas/${mangaId}/volumes/${volumeId}/chapters`)
			router.refresh()
		} catch (error) {
			console.error(error)
			alert(error instanceof Error ? error.message : 'Erro desconhecido')
		} finally {
			setIsLoading(false)
		}
	}

	if (isFetching) {
		return (
			<div className="flex items-center justify-center py-20 text-primary">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	return (
		<>
			<div className="flex items-center gap-4 mb-4">
				<Button variant="outline" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Editar Capítulo {chapterNumber}
					</h1>
					<p className="text-sm text-muted-foreground">
						Modifique o título ou substitua as páginas desta edição.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_400px]">
				<div className="space-y-6">
					{/* Detalhes */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5 text-primary" />
								Informações
							</CardTitle>
						</CardHeader>
						<CardContent className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Número</Label>
								<Input
									type="number"
									value={chapterNumber}
									onChange={(e) => setChapterNumber(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label>Título (Opcional)</Label>
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Ex: O Início"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Preview das Páginas */}
					<Card>
						<CardHeader>
							<CardTitle>Visualização das Páginas</CardTitle>
							<CardDescription>
								{newPagesFiles.length > 0
									? `Atenção: Estas ${newPagesFiles.length} novas imagens irão SUBSTITUIR as atuais.`
									: `Mostrando as ${existingPages.length} páginas atuais.`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
								{(newPagesFiles.length > 0
									? newPagesFiles.map((f) => URL.createObjectURL(f))
									: existingPages
								).map((url, i) => (
									<div
										key={i}
										className="aspect-[2/3] rounded border border-border overflow-hidden bg-muted relative group"
									>
										{/* 🔥 Regra de ouro aplicada: tag <img> nativa em vez de Next Image para previews híbridos */}
										<img
											src={url}
											className="w-full h-full object-cover"
											alt={`Página ${i + 1}`}
											loading="eager"
										/>
										<div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded">
											{i + 1}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar de Ações */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Atualizar Imagens</CardTitle>
							<CardDescription>
								Clique para selecionar novas páginas (lote).
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Label
								htmlFor="page-upload"
								className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
							>
								<Upload className="h-8 w-8 text-muted-foreground mb-2" />
								<span className="text-xs font-medium text-muted-foreground text-center px-4">
									Clique para substituir
									<br />
									todas as páginas
								</span>
							</Label>
							<input
								id="page-upload"
								type="file"
								multiple
								accept="image/*"
								className="hidden"
								onChange={(e) => setNewPagesFiles(Array.from(e.target.files || []))}
							/>

							{newPagesFiles.length > 0 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="w-full text-destructive"
									onClick={() => setNewPagesFiles([])}
								>
									<X className="h-4 w-4 mr-2" /> Cancelar novas imagens
								</Button>
							)}
						</CardContent>
					</Card>

					<Button type="submit" className="w-full h-12 font-bold" disabled={isLoading}>
						{isLoading ? (
							'A guardar...'
						) : (
							<>
								<Save className="mr-2 h-5 w-5" /> Atualizar Capítulo
							</>
						)}
					</Button>
				</div>
			</form>
		</>
	)
}
