'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { Manga } from '@workspace/types'

interface MangaGridProps {
	mangas: Manga[]
	favoritedIds?: number[]
}

export default function MangaGrid({ mangas, favoritedIds = [] }: MangaGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
			{mangas.map((manga, index) => {
				const imageUrl = manga.coverUrl
					? manga.coverUrl
					: 'https://placehold.co/300x400/1a1a1a/white.png?text=Sem+Capa'

				return (
					<motion.div
						key={manga.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.05 }}
						// 🔥 Adicionamos 'relative' ao container pai para segurar a fita FORA do card
						className="group cursor-pointer relative"
					>
						{/* 🔥 A NOVA FITA DE FAVORITOS ESTILIZADA */}
						{favoritedIds?.includes(manga.id) && (
							<div
								className="absolute -top-2.5 -right-2 z-30 drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-105"
								title="Na sua biblioteca"
							>
								{/* Corpo da Fita com recorte em V e Gradiente Premium */}
								<div
									className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-800 border-t border-red-400 rounded-t-[2px] relative"
									style={{
										clipPath:
											'polygon(100% 0, 0 0, 0 100%, 50% 85%, 100% 100%)',
									}}
								>
									{/* Ícone de Bookmark sutil centralizado */}
									<Bookmark className="w-4 h-4 text-white/90 absolute top-2 left-1/2 -translate-x-1/2 fill-white/20" />
								</div>

								{/* Detalhe 3D lateral (a dobrinha da fita) */}
								<div className="absolute top-[8px] -right-[4px] w-1 h-2 bg-red-950 rounded-sm -z-10" />
							</div>
						)}

						<Link href={`/mangas/${manga.id}`}>
							{/* Transferimos os hovers para 'group-hover' para animar em sincronia com a fita */}
							<div className="relative overflow-hidden rounded-xl bg-gray-900 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl border border-gray-800 group-hover:border-brand-primary flex flex-col h-full">
								<div className="aspect-3/4 relative bg-gray-950">
									<Image
										src={imageUrl}
										alt={manga.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover"
										loading="lazy"
										unoptimized={imageUrl.includes('localhost')}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>

								<div className="p-4 bg-brand-gray flex-1 flex flex-col justify-between">
									<h3
										className="font-semibold text-white text-base mb-1 line-clamp-1"
										title={manga.title}
									>
										{manga.title}
									</h3>

									<div className="flex items-center justify-between text-sm mt-1">
										<span className="text-gray-400 text-xs font-medium">
											{manga.updatedAt
												? new Date(manga.updatedAt).toLocaleDateString(
														'pt-BR'
													)
												: 'Vol. 1'}
										</span>
										<span className="text-brand-primary font-bold text-[10px] tracking-widest uppercase">
											NOVO
										</span>
									</div>
								</div>
							</div>
						</Link>
					</motion.div>
				)
			})}
		</div>
	)
}
