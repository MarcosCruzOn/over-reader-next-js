'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Layers, Upload, BookImage } from 'lucide-react'

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

import { api } from '@/lib/api'

export default function NewVolumePage({ params }: { params: Promise<{ mangaId: string }> }) {
	const router = useRouter()

	const resolvedParams = React.use(params)
	const mangaId = Number(resolvedParams.mangaId)

	const [volumeNumber, setVolumeNumber] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [coverFile, setCoverFile] = React.useState<File | null>(null)
	const [isLoading, setIsLoading] = React.useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		console.log('🚀 Iniciando a criação do volume...') // Rastreador no Console

		if (!coverFile) {
			alert('A Capa do volume é OBRIGATÓRIA para o layout em grelha funcionar!')
			console.error('Erro: Tentativa de guardar sem imagem de capa.')
			return
		}

		setIsLoading(true)

		try {
			console.log('Passo 1: A criar dados na base de dados...')
			const res = await api.createVolume({
				mangaId,
				volumeNumber: Number(volumeNumber),
				title: title ? title : undefined,
			})

			if (!res.ok) {
				const errorText = await res.text()
				throw new Error(`Erro do servidor ao criar volume: ${errorText}`)
			}

			const newVolume = await res.json()
			console.log('Volume criado com sucesso! ID:', newVolume.id)

			console.log('Passo 2: A enviar a Capa para a AWS S3...')
			if (newVolume.id && coverFile) {
				const formData = new FormData()
				formData.append('cover', coverFile)

				const uploadRes = await api.uploadVolumeCover(newVolume.id, formData)

				if (!uploadRes.ok) {
					const errorText = await uploadRes.text()
					throw new Error(`Volume criado, mas falhou ao enviar a capa: ${errorText}`)
				}
			}

			console.log('✅ Tudo finalizado! A redirecionar...')
			router.push(`/mangas/${mangaId}/volumes`)
			router.refresh()
		} catch (error) {
			console.error('❌ ERRO GRAVE CAPTURADO:', error)
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
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">Novo Volume</h1>
					<p className="text-muted-foreground text-sm">
						A adicionar uma nova edição ao mangá.
					</p>
				</div>
			</div>

			{/* 🔥 O <form> agora abraça todo o grid sem elementos de layout extra! */}
			<form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_400px]">
				{/* Informações do Volume */}
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
									placeholder="Ex: 1"
									required
									min="1"
									value={volumeNumber}
									onChange={(e) => setVolumeNumber(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="title">Título do Volume (Opcional)</Label>
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

				{/* Upload da Capa do Volume e Botão */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Capa do Volume</CardTitle>
							<CardDescription>Para o layout em grelha.</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-lg p-6 bg-muted/20">
								{coverFile ? (
									<div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-muted">
										{/* Nota de otimização: A usar tag img nativa para URLs do tipo blob para evitar erros do Next/Image */}
										<img
											alt="Pré-visualização da Capa"
											src={URL.createObjectURL(coverFile)}
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
						className="w-full h-12 text-md font-bold"
						disabled={isLoading}
					>
						{isLoading ? (
							'A guardar...'
						) : (
							<>
								<Save className="mr-2 h-5 w-5" /> Registar Volume
							</>
						)}
					</Button>
				</div>
			</form>
		</>
	)
}
