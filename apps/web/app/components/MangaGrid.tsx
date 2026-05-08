'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
// import { Bookmark } from 'lucide-react'
import { Manga } from '@workspace/types'

interface MangaGridProps {
	mangas: Manga[]
}

export default function MangaGrid({ mangas }: MangaGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
			{mangas.map((manga, index) => {
				const imageUrl = manga.coverUrl
					? manga.coverUrl
					: 'https://placehold.co/300x400/1a1a1a/white.png?text=Sem+Capa'

				console.log('URL DA IMAGEM VINDA DO BANCO mangagrid:', manga.coverUrl)
				return (
					<motion.div
						key={manga.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.05 }}
						className="group cursor-pointer"
					>
						<div className="relative overflow-hidden rounded-xl bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-800 hover:border-[#C41E3A]">
							<div className="aspect-3/4 relative bg-gray-950">
								<Image
									src={imageUrl}
									alt={manga.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover"
									unoptimized={imageUrl.includes('localhost')} // Resolve o erro de IP privado!
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							</div>

							<div className="p-4 bg-gray-900">
								<h3
									className="font-semibold text-white text-base mb-1 line-clamp-1"
									title={manga.title}
								>
									{manga.title}
								</h3>
								<div className="flex items-center justify-between text-sm">
									{/* Placeholders temporários */}
									<span className="text-gray-400">Vol. 1</span>
									<span className="text-[#C41E3A] font-medium text-xs tracking-wide">
										NOVO
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				)
			})}
		</div>
	)
}
