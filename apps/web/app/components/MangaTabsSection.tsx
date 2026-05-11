'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutGrid, List as ListIcon, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@workspace/ui/components/tabs'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog'

// Tipagens para receber os dados do servidor
interface MangaTabsSectionProps {
	manga: any
	chapters: any[]
	groupedVolumes: any[]
}

export default function MangaTabsSection({
	manga,
	chapters,
	groupedVolumes,
}: MangaTabsSectionProps) {
	// Estados que controlam a interface
	const [activeTab, setActiveTab] = useState('vol')
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

	// Função inteligente: se for para a aba CH, força a visualização em lista!
	const handleTabChange = (value: string) => {
		setActiveTab(value)
		if (value === 'ch') {
			setViewMode('list')
		}
	}

	const coverFallback =
		manga.coverUrl || 'https://placehold.co/300x400/1a1a1a/white.png?text=Sem+Capa'

	return (
		<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
			{/* CABEÇALHO DAS ABAS E CONTROLES */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 mb-4 gap-4">
				<TabsList className="bg-transparent border-none p-0 gap-6">
					<TabsTrigger
						value="vol"
						className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
					>
						VOL.
					</TabsTrigger>
					<TabsTrigger
						value="ch"
						className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
					>
						CH.
					</TabsTrigger>
					<TabsTrigger
						value="gallery"
						className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-base font-bold text-muted-foreground"
					>
						Galeria
					</TabsTrigger>
				</TabsList>

				{/* CONTROLES GRID / LIST */}
				<div className="flex items-center gap-4 text-muted-foreground">
					<div
						className={`flex items-center gap-2 transition-opacity ${activeTab === 'ch' ? 'opacity-30 pointer-events-none' : ''}`}
					>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-1 transition-colors ${viewMode === 'grid' ? 'text-primary' : 'hover:text-foreground'}`}
							title="Visualização em Grid"
						>
							<LayoutGrid className="h-5 w-5" />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-1 transition-colors ${viewMode === 'list' ? 'text-primary' : 'hover:text-foreground'}`}
							title="Visualização em Lista"
						>
							<ListIcon className="h-6 w-6" />
						</button>
					</div>
					<div className="h-6 w-px bg-border mx-2"></div>
					<select className="bg-transparent border-b border-border text-sm font-medium focus:outline-none text-foreground pb-1 cursor-pointer">
						<option value="latest" className="bg-card">
							Mais Recentes
						</option>
						<option value="oldest" className="bg-card">
							Mais Antigos
						</option>
					</select>
				</div>
			</div>

			{/* 📚 ABA DE VOLUMES */}
			<TabsContent value="vol" className="mt-0">
				{viewMode === 'list' ? (
					// VISUALIZAÇÃO EM LISTA (A Sanfona que criamos antes)
					<div className="flex flex-col gap-3">
						{groupedVolumes.map((vol) => (
							<details
								key={vol.number}
								className="group border border-border rounded-lg bg-background overflow-hidden transition-all duration-300"
							>
								<summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
									<div className="flex items-center gap-4">
										<span className="font-bold text-foreground text-lg uppercase">
											Volume {vol.number}
										</span>
										<span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
											{vol.chapters.length} Capítulos
										</span>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-xs text-muted-foreground font-medium uppercase hidden sm:block">
											Atualizado:{' '}
											{vol.latestDate
												? new Date(vol.latestDate).toLocaleDateString(
														'pt-BR'
													)
												: 'N/A'}
										</span>
										<ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
									</div>
								</summary>
								<div className="border-t border-border bg-card">
									{vol.chapters.map((ch: any, index: number) => (
										<Link
											key={ch.id}
											href={`/mangas/${manga.id}/read/${ch.chapterNumber}`}
											className={`flex items-center justify-between py-3 px-6 hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}`}
										>
											<span className="font-semibold text-foreground text-sm uppercase">
												Cap. {ch.chapterNumber}{' '}
												<span className="text-muted-foreground font-normal ml-2 hidden md:inline">
													— {ch.title}
												</span>
											</span>
											<span className="text-xs text-muted-foreground">
												{new Date(ch.createdAt).toLocaleDateString('pt-BR')}
											</span>
										</Link>
									))}
								</div>
							</details>
						))}
					</div>
				) : (
					// 🔥 NOVA VISUALIZAÇÃO EM GRID (Com Modais)
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
						{groupedVolumes.map((vol) => (
							<Dialog key={vol.number}>
								<DialogTrigger asChild>
									<div className="group cursor-pointer rounded-xl border border-border bg-background overflow-hidden hover:border-primary transition-colors shadow-sm">
										<div className="aspect-[2/3] relative bg-muted">
											<Image
												src={coverFallback}
												alt={`Volume ${vol.number}`}
												fill
												sizes="(max-width: 768px) 50vw, 20vw"
												className="object-cover transition-transform duration-300 group-hover:scale-105"
												unoptimized={coverFallback.includes('localhost')}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
											<div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-white font-black text-sm px-2 py-1 rounded">
												VOL {vol.number}
											</div>
										</div>
										<div className="p-4 bg-card">
											<h4 className="font-bold text-foreground text-sm mb-1 line-clamp-1 text-center group-hover:text-primary transition-colors">
												Volume {vol.number}
											</h4>
											<p className="text-xs text-muted-foreground text-center">
												{vol.chapters.length} Capítulos
											</p>
										</div>
									</div>
								</DialogTrigger>

								{/* O CONTEÚDO DO MODAL */}
								<DialogContent className="max-w-md bg-card border-border text-foreground">
									<DialogHeader>
										<DialogTitle className="text-2xl font-black uppercase text-center border-b border-border pb-4">
											Volume {vol.number}
										</DialogTitle>
									</DialogHeader>
									<div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 mt-4 custom-scrollbar">
										{vol.chapters.map((ch: any) => (
											<Link
												key={ch.id}
												href={`/mangas/${manga.id}/read/${ch.chapterNumber}`}
												className="p-4 bg-background hover:bg-muted border border-border hover:border-primary rounded-xl flex items-center justify-between transition-all group"
											>
												<span className="font-bold text-foreground group-hover:text-primary transition-colors">
													Cap. {ch.chapterNumber}
												</span>
												<span className="text-xs text-muted-foreground font-medium">
													{new Date(ch.createdAt).toLocaleDateString(
														'pt-BR'
													)}
												</span>
											</Link>
										))}
									</div>
								</DialogContent>
							</Dialog>
						))}
					</div>
				)}
			</TabsContent>

			{/* 📖 ABA DE CAPÍTULOS (Sempre em Lista, o Grid foi desabilitado no header) */}
			<TabsContent value="ch" className="mt-0">
				<div className="flex flex-col">
					{chapters.length > 0 ? (
						chapters.map((ch: any, index: number) => (
							<Link
								key={ch.id}
								href={`/mangas/${manga.id}/read/${ch.chapterNumber}`}
								className={`flex items-center justify-between py-4 px-4 hover:bg-muted/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}`}
							>
								<div className="flex items-center gap-4">
									<div
										className={`h-2 w-2 rounded-full ${new Date(ch.createdAt) > new Date(Date.now() - 172800000) ? 'bg-primary' : 'bg-transparent'}`}
									></div>
									<span className="font-semibold text-foreground uppercase">
										Cap. {ch.chapterNumber}
									</span>
									<span className="text-muted-foreground text-sm font-normal hidden md:inline">
										— {ch.title || 'Sem título'}
									</span>
								</div>
								<span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
									{new Date(ch.createdAt).toLocaleDateString('pt-BR')}
								</span>
							</Link>
						))
					) : (
						<div className="text-center py-12 text-muted-foreground">
							Nenhum capítulo disponível.
						</div>
					)}
				</div>
			</TabsContent>

			{/* 🖼️ ABA DE GALERIA */}
			<TabsContent value="gallery">
				<div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-4 bg-muted/10">
					<p className="mb-2 text-lg font-medium">Galeria de Artes em Breve</p>
					<p className="text-sm opacity-60">
						Aqui ficarão as artes oficiais, capas de volumes e ilustrações.
					</p>
				</div>
			</TabsContent>
		</Tabs>
	)
}
