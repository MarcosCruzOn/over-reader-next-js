'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Settings, List, MessageSquare, Check } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from '@workspace/ui/components/dropdown-menu'

interface ReaderClientProps {
	mangaId: string
	chapterId: string
	pages: string[]
	chaptersList: any[] // 🔥 Inserido na tipagem do componente
	prevChapter: number | null
	nextChapter: number
}

export function ReaderClient({
	mangaId,
	chapterId,
	pages,
	chaptersList,
	prevChapter,
	nextChapter,
}: ReaderClientProps) {
	const [readMode, setReadMode] = useState<'scroll' | 'paged'>('scroll')
	const [imageWidth, setImageWidth] = useState<'max-w-3xl' | 'max-w-5xl' | 'w-full'>('max-w-3xl')
	const [bgColor, setBgColor] = useState<'bg-black' | 'bg-[#1a1a1a]' | 'bg-white'>('bg-black')

	const [currentPage, setCurrentPage] = useState(0)

	const handleNextPage = () => {
		if (currentPage < pages.length - 1) setCurrentPage((p) => p + 1)
	}

	const handlePrevPage = () => {
		if (currentPage > 0) setCurrentPage((p) => p - 1)
	}

	return (
		<div
			className={`min-h-screen ${bgColor === 'bg-white' ? 'text-black' : 'text-white'} selection:bg-primary selection:text-white pb-24 transition-colors duration-300 ${bgColor}`}
		>
			{/* 🧭 NAVBAR SUPERIOR */}
			<header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href={`/mangas/${mangaId}`}>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white hover:bg-white/10"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
					</Link>
					<div className="flex flex-col">
						<span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
							Lendo agora
						</span>
						<h1 className="font-bold text-sm md:text-base text-white line-clamp-1">
							Capítulo {chapterId}
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-1 sm:gap-2">
					{/* GAVETA DE CAPÍTULOS 🔥 TOTALMENTE DINÂMICA E INTERATIVA */}
					<Sheet>
						<SheetTrigger
							className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
							title="Lista de Capítulos"
						>
							<List className="h-5 w-5" />
						</SheetTrigger>
						<SheetContent className="bg-[#0a0a0a] border-white/10 text-white w-full sm:w-[400px] flex flex-col h-full pb-6">
							<SheetHeader className="mb-4">
								<SheetTitle className="text-white font-black uppercase flex items-center gap-2">
									<List className="w-5 h-5 text-primary" />
									Lista de Capítulos
								</SheetTitle>
							</SheetHeader>

							{/* Container de rolagem interna */}
							<div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
								{chaptersList && chaptersList.length > 0 ? (
									chaptersList.map((ch) => {
										const isCurrent =
											Number(ch.chapterNumber) === Number(chapterId)
										return (
											<Link
												key={ch.id}
												href={`/mangas/${mangaId}/read/${ch.chapterNumber}`}
												className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
													isCurrent
														? 'bg-primary/20 border-primary text-primary font-bold'
														: 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10'
												}`}
											>
												<div className="flex flex-col min-w-0">
													<span className="text-sm uppercase font-bold tracking-tight">
														Capítulo {ch.chapterNumber}
													</span>
													{ch.title && (
														<span className="text-xs text-gray-500 block font-normal normal-case truncate max-w-[240px] mt-0.5">
															{ch.title}
														</span>
													)}
												</div>
												{isCurrent && (
													<span className="text-[10px] bg-primary text-white font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
														Lendo
													</span>
												)}
											</Link>
										)
									})
								) : (
									<div className="flex flex-col h-full justify-center items-center text-muted-foreground mt-10">
										<List className="w-12 h-12 mb-4 opacity-20" />
										<p>Nenhum capítulo disponível.</p>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>

					{/* GAVETA DE COMENTÁRIOS */}
					<Sheet>
						<SheetTrigger
							className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none relative"
							title="Comentários"
						>
							<MessageSquare className="h-5 w-5" />
							<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border border-[#050505]"></span>
						</SheetTrigger>
						<SheetContent className="bg-[#0a0a0a] border-white/10 text-white w-full sm:w-[450px] overflow-y-auto">
							<SheetHeader className="mb-6">
								<SheetTitle className="text-white font-black uppercase flex items-center gap-2">
									<MessageSquare className="w-5 h-5 text-primary" /> Comentários
									(0)
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col h-full items-center justify-center text-muted-foreground py-20 border-2 border-dashed border-white/10 rounded-xl">
								<MessageSquare className="w-12 h-12 mb-4 opacity-20" />
								<p className="font-bold text-white">Seja o primeiro a comentar!</p>
							</div>
						</SheetContent>
					</Sheet>

					{/* MENU DE CONFIGURAÇÕES */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className="h-9 w-9 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none hidden sm:inline-flex"
							title="Configurações"
						>
							<Settings className="h-5 w-5" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-56 bg-[#0a0a0a] border-white/10 text-white shadow-2xl"
						>
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">
									Modo de Leitura
								</DropdownMenuLabel>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-white/10 flex justify-between"
									onClick={() => setReadMode('scroll')}
								>
									Cascata (Webtoon){' '}
									{readMode === 'scroll' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-white/10 flex justify-between"
									onClick={() => setReadMode('paged')}
								>
									Página Única{' '}
									{readMode === 'paged' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="bg-white/10" />
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">
									Largura da Página
								</DropdownMenuLabel>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-white/10 flex justify-between"
									onClick={() => setImageWidth('max-w-3xl')}
								>
									Padrão{' '}
									{imageWidth === 'max-w-3xl' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-white/10 flex justify-between"
									onClick={() => setImageWidth('max-w-5xl')}
								>
									Larga{' '}
									{imageWidth === 'max-w-5xl' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-white/10 flex justify-between"
									onClick={() => setImageWidth('w-full')}
								>
									Tela Cheia{' '}
									{imageWidth === 'w-full' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="bg-white/10" />
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wider">
									Cor de Fundo
								</DropdownMenuLabel>
								<div className="flex gap-2 p-2">
									<button
										onClick={() => setBgColor('bg-black')}
										className={`w-8 h-8 rounded-full bg-black border-2 ${bgColor === 'bg-black' ? 'border-primary' : 'border-gray-600'}`}
										title="Preto"
									></button>
									<button
										onClick={() => setBgColor('bg-[#1a1a1a]')}
										className={`w-8 h-8 rounded-full bg-[#1a1a1a] border-2 ${bgColor === 'bg-[#1a1a1a]' ? 'border-primary' : 'border-gray-600'}`}
										title="Cinza Escuro"
									></button>
									<button
										onClick={() => setBgColor('bg-white')}
										className={`w-8 h-8 rounded-full bg-white border-2 ${bgColor === 'bg-white' ? 'border-primary' : 'border-gray-600'}`}
										title="Branco"
									></button>
								</div>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			{/* MOTOR DE LEITURA */}
			<main
				className={`mx-auto flex flex-col items-center min-h-screen transition-all duration-500 ease-in-out ${imageWidth}`}
			>
				{readMode === 'scroll' &&
					pages.map((pageUrl, index) => (
						<div key={index} className="w-full flex justify-center">
							<img
								src={pageUrl}
								alt={`Página ${index + 1}`}
								className="w-full h-auto block"
								loading={index < 3 ? 'eager' : 'lazy'}
							/>
						</div>
					))}
				{readMode === 'paged' && (
					<div className="relative w-full flex flex-col items-center pt-8">
						<div
							className="w-full flex justify-center cursor-e-resize"
							onClick={handleNextPage}
							title="Clique para avançar"
						>
							<img
								src={pages[currentPage]}
								alt={`Página ${currentPage + 1}`}
								className="w-full h-auto max-h-[85vh] object-contain shadow-2xl"
							/>
						</div>
						<div className="flex items-center gap-6 mt-8">
							<Button
								variant="outline"
								onClick={handlePrevPage}
								disabled={currentPage === 0}
								className="bg-[#050505] text-white border-white/20"
							>
								<ChevronLeft className="w-4 h-4 mr-2" /> Anterior
							</Button>
							<span
								className={`font-bold ${bgColor === 'bg-white' ? 'text-black' : 'text-white'}`}
							>
								Pág. {currentPage + 1} / {pages.length}
							</span>
							<Button
								variant="outline"
								onClick={handleNextPage}
								disabled={currentPage === pages.length - 1}
								className="bg-[#050505] text-white border-white/20"
							>
								Próxima <ChevronRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				)}
			</main>

			{/* NAVBAR INFERIOR */}
			<footer className="fixed bottom-0 w-full bg-[#050505]/95 backdrop-blur-md border-t border-white/5 p-4 z-50">
				<div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
					{prevChapter ? (
						<Link href={`/mangas/${mangaId}/read/${prevChapter}`} className="flex-1">
							<Button
								variant="outline"
								className="w-full bg-transparent border-white/10 text-white hover:bg-white/10 h-12"
							>
								<ChevronLeft className="h-4 w-4 mr-2" /> Capítulo Anterior
							</Button>
						</Link>
					) : (
						<Button
							disabled
							variant="outline"
							className="flex-1 bg-transparent border-white/5 text-white/30 h-12"
						>
							<ChevronLeft className="h-4 w-4 mr-2" /> Capítulo Anterior
						</Button>
					)}
					<Link href={`/mangas/${mangaId}/read/${nextChapter}`} className="flex-1">
						<Button className="w-full bg-primary hover:bg-brand-dark text-white font-bold h-12">
							Próximo Capítulo <ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</Link>
				</div>
			</footer>
		</div>
	)
}
