import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Manga } from '@workspace/types'

interface SidebarProps {
	savedMangas: Manga[]
}

export default function SavedMangasSidebar({ savedMangas }: SidebarProps) {
	if (!savedMangas || savedMangas.length === 0) return null

	return (
		<aside className="hidden lg:block">
			<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">
				<h3 className="text-xl font-bold text-gray-100 mb-6">Salvos Recentemente</h3>

				<div className="space-y-4">
					{savedMangas.map((manga) => {
						const imageUrl = manga.coverUrl
							? manga.coverUrl
							: 'https://placehold.co/80x120/1a1a1a/white.png?text=Sem+Capa'

						return (
							<div
								key={manga.id}
								className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer group"
							>
								<div className="shrink-0 relative w-12 h-16">
									<Image
										src={imageUrl}
										alt={manga.title}
										fill
										sizes="48px"
										className="object-cover rounded-lg shadow-sm"
										unoptimized={imageUrl.includes('localhost')}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-semibold text-gray-100 text-sm line-clamp-1 group-hover:text-[#C41E3A] transition-colors">
										{manga.title}
									</h4>
									<p className="text-xs text-gray-500 mt-0.5">
										{/* Placeholder pois ainda não temos capítulos na API */}
										ATUAL:{' '}
										<span className="font-medium text-[#C41E3A]">CH. 1</span>
									</p>
								</div>
							</div>
						)
					})}
				</div>

				<Link
					href="/saved"
					className="mt-6 flex items-center justify-between w-full p-3 bg-gray-950 hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
				>
					<span className="text-sm font-medium text-gray-400 group-hover:text-[#C41E3A] transition-colors">
						Ver todos salvos
					</span>
					<ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-[#C41E3A] group-hover:translate-x-1 transition-all duration-200" />
				</Link>
			</div>
		</aside>
	)
}
