'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	ChevronLeft,
	ChevronRight,
	Settings,
	MessageSquare,
	Check,
	ChevronDown,
} from 'lucide-react'
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

import { ChapterComments } from '@/app/components/ChapterComments'
import Header from '@/app/components/Header'

interface ReaderClientProps {
	mangaId: string
	chapterId: string
	pages: string[]
	chaptersList: any[]
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
	const router = useRouter()

	const [readMode, setReadMode] = useState<'scroll' | 'paged'>('scroll')
	const [imageWidth, setImageWidth] = useState<'max-w-3xl' | 'max-w-5xl' | 'w-full'>('max-w-3xl')
	const [bgColor, setBgColor] = useState<'bg-black' | 'bg-[#1a1a1a]' | 'bg-white'>('bg-black')

	const [currentPage, setCurrentPage] = useState(0)

	const currentChapterData = chaptersList?.find(
		(ch) => Number(ch.chapterNumber) === Number(chapterId)
	)
	const realDatabaseChapterId = currentChapterData?.id

	const handleNextPage = () => {
		if (currentPage < pages.length - 1) setCurrentPage((p) => p + 1)
	}

	const handlePrevPage = () => {
		if (currentPage > 0) setCurrentPage((p) => p - 1)
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor === 'bg-white' ? 'text-black' : 'text-white'} selection:bg-primary selection:text-white transition-colors duration-300 ${bgColor}`}
		>
			<Header />

			{/* ⚪ READING BAR SECUNDÁRIA */}
			<div className="sticky top-16 z-40 bg-card text-card-foreground border-b border-border h-14 flex items-center justify-between px-4 sm:px-8 shadow-sm shrink-0">
				<div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
					<Link
						href={`/mangas/${mangaId}`}
						className="text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase whitespace-nowrap"
					>
						Obra
					</Link>
					<span className="text-muted-foreground">/</span>

					{/* DROPDOWN DE CAPÍTULOS */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-2 text-sm sm:text-base font-black uppercase border-b-2 border-primary pb-1 px-1 outline-none hover:bg-muted transition-colors whitespace-nowrap text-foreground">
							CAPÍTULO {chapterId} <ChevronDown className="w-4 h-4 text-primary" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48 max-h-[60vh] overflow-y-auto bg-card border-border custom-scrollbar">
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-muted-foreground uppercase">
									Ir para o capítulo
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-border" />
								{chaptersList && chaptersList.length > 0 ? (
									chaptersList.map((ch) => {
										const isCurrent =
											Number(ch.chapterNumber) === Number(chapterId)
										return (
											<DropdownMenuItem
												key={ch.id}
												className={`cursor-pointer w-full flex justify-between ${isCurrent ? 'text-primary font-black bg-primary/10' : 'font-medium'}`}
												onClick={() =>
													router.push(
														`/mangas/${mangaId}/read/${ch.chapterNumber}`
													)
												}
											>
												Cap. {ch.chapterNumber}
												{isCurrent && <Check className="w-4 h-4" />}
											</DropdownMenuItem>
										)
									})
								) : (
									<div className="p-2 text-sm text-muted-foreground">
										Nenhum capítulo
									</div>
								)}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="flex items-center gap-2 ml-2 sm:ml-4">
						{prevChapter && (
							<Link href={`/mangas/${mangaId}/read/${prevChapter}`}>
								<Button
									variant="outline"
									size="sm"
									className="bg-transparent border-border hover:bg-muted text-xs h-8 px-2"
								>
									<ChevronLeft className="w-4 h-4 sm:mr-1" />{' '}
									<span className="hidden sm:inline">Anterior</span>
								</Button>
							</Link>
						)}
						{nextChapter ? (
							<Link href={`/mangas/${mangaId}/read/${nextChapter}`}>
								<Button
									size="sm"
									className="bg-primary hover:bg-brand-dark text-primary-foreground text-xs font-bold h-8"
								>
									<span className="hidden sm:inline">Próximo</span>{' '}
									<ChevronRight className="w-4 h-4 sm:ml-1" />
								</Button>
							</Link>
						) : (
							<Button
								disabled
								size="sm"
								variant="outline"
								className="opacity-50 text-xs h-8"
							>
								Último Cap.
							</Button>
						)}
					</div>
				</div>

				<div className="bg- flex items-center gap-1 sm:gap-4 shrink-0">
					{/* GAVETA DE COMENTÁRIOS */}
					<Sheet>
						<SheetTrigger
							className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none relative px-2"
							title="Comunidade"
						>
							<MessageSquare className="h-5 w-5" />
							<span className="text-[10px] font-bold uppercase mt-0.5 hidden sm:block">
								Comentar
							</span>
							<span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-primary border border-card"></span>
						</SheetTrigger>
						<SheetContent className="bg-[#0a0a0a] border-zinc-800 text-white w-full sm:w-[450px] flex flex-col h-full pb-0 px-0 shadow-2xl [&>button]:text-white [&>button]:hover:text-primary">
							<SheetHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-zinc-800">
								<SheetTitle className="text-white font-black uppercase flex items-center gap-2">
									<MessageSquare className="w-5 h-5 text-primary" /> Comunidade
								</SheetTitle>
							</SheetHeader>
							<div className="flex-1 overflow-hidden">
								{realDatabaseChapterId ? (
									<ChapterComments chapterId={realDatabaseChapterId} />
								) : (
									<div className="flex items-center justify-center h-full text-zinc-500">
										A carregar comunidade...
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>

					{/* CONFIGURAÇÕES DE LEITURA */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none px-2"
							title="Modo de Leitura"
						>
							<Settings className="h-5 w-5" />
							<span className="text-[10px] font-bold uppercase mt-0.5 hidden sm:block">
								Ajustes
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-64 bg-card border-border text-foreground shadow-2xl"
						>
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
									Modo de Leitura
								</DropdownMenuLabel>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-muted flex justify-between font-medium"
									onClick={() => setReadMode('scroll')}
								>
									Cascata (Webtoon){' '}
									{readMode === 'scroll' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-muted flex justify-between font-medium"
									onClick={() => setReadMode('paged')}
								>
									Página Única{' '}
									{readMode === 'paged' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
									Largura da Imagem
								</DropdownMenuLabel>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-muted flex justify-between font-medium"
									onClick={() => setImageWidth('max-w-3xl')}
								>
									Padrão{' '}
									{imageWidth === 'max-w-3xl' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-muted flex justify-between font-medium"
									onClick={() => setImageWidth('max-w-5xl')}
								>
									Larga{' '}
									{imageWidth === 'max-w-5xl' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer hover:bg-muted flex justify-between font-medium"
									onClick={() => setImageWidth('w-full')}
								>
									Tela Cheia{' '}
									{imageWidth === 'w-full' && (
										<Check className="h-4 w-4 text-primary" />
									)}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuGroup>
								<DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
									Cor de Fundo
								</DropdownMenuLabel>
								<div className="flex gap-3 p-2">
									<button
										onClick={() => setBgColor('bg-black')}
										className={`w-8 h-8 rounded-full bg-black border-2 shadow-sm ${bgColor === 'bg-black' ? 'border-primary ring-2 ring-primary/30' : 'border-gray-700'}`}
										title="Preto"
									></button>
									<button
										onClick={() => setBgColor('bg-[#1a1a1a]')}
										className={`w-8 h-8 rounded-full bg-[#1a1a1a] border-2 shadow-sm ${bgColor === 'bg-[#1a1a1a]' ? 'border-primary ring-2 ring-primary/30' : 'border-gray-700'}`}
										title="Cinza Escuro"
									></button>
									<button
										onClick={() => setBgColor('bg-white')}
										className={`w-8 h-8 rounded-full bg-white border-2 shadow-sm ${bgColor === 'bg-white' ? 'border-primary ring-2 ring-primary/30' : 'border-gray-300'}`}
										title="Branco"
									></button>
								</div>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* 📖 ÁREA DE LEITURA DO MANGÁ */}
			<main
				className={`flex-1 flex flex-col items-center mx-auto transition-all duration-500 ease-in-out w-full ${imageWidth} pt-6 pb-24`}
			>
				{readMode === 'scroll' && (
					<div className="w-full flex flex-col items-center shadow-2xl">
						{pages.map((pageUrl, index) => (
							<div key={index} className="w-full flex justify-center">
								<img
									src={pageUrl}
									alt={`Página ${index + 1}`}
									className="w-full h-auto block"
									loading={index < 3 ? 'eager' : 'lazy'}
								/>
							</div>
						))}
					</div>
				)}

				{readMode === 'paged' && (
					<div className="relative w-full flex flex-col items-center">
						<div
							className="w-full flex justify-center cursor-e-resize shadow-2xl"
							onClick={handleNextPage}
							title="Clique para avançar"
						>
							<img
								src={pages[currentPage]}
								alt={`Página ${currentPage + 1}`}
								className="w-full h-auto max-h-[85vh] object-contain"
							/>
						</div>

						<div className="flex items-center justify-between w-full max-w-md mt-8 px-4">
							<Button
								variant="outline"
								onClick={handlePrevPage}
								disabled={currentPage === 0}
								className="bg-card text-card-foreground border-border hover:bg-muted font-bold"
							>
								<ChevronLeft className="w-4 h-4 mr-2" /> Anterior
							</Button>
							<span
								className={`font-black text-sm uppercase tracking-widest opacity-60`}
							>
								{currentPage + 1} / {pages.length}
							</span>
							<Button
								variant="outline"
								onClick={handleNextPage}
								disabled={currentPage === pages.length - 1}
								className="bg-card text-card-foreground border-border hover:bg-muted font-bold"
							>
								Próxima <ChevronRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				)}
			</main>
		</div>
	)
}
