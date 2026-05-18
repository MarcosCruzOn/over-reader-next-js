'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Manga } from '@workspace/types'

interface HeroProps {
	mangas: Manga[]
}

export default function Hero({ mangas }: HeroProps) {
	const [currentSlide, setCurrentSlide] = useState(0)

	// 1. Usamos o useCallback para memorizar as funções e evitar os avisos do ESLint
	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % mangas.length)
	}, [mangas.length])

	const prevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + mangas.length) % mangas.length)
	}, [mangas.length])

	const goToSlide = (index: number) => setCurrentSlide(index)

	// 2. Agora o useEffect inclui o nextSlide e prevSlide nas dependências (sem avisos!)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') prevSlide()
			if (e.key === 'ArrowRight') nextSlide()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [nextSlide, prevSlide])

	// 3. O intervalo também recebe o nextSlide como dependência
	useEffect(() => {
		const timer = setInterval(nextSlide, 5000)
		return () => clearInterval(timer)
	}, [nextSlide])

	if (!mangas || mangas.length === 0) return null

	const currentManga = mangas[currentSlide]

	if (!currentManga) return null

	// Verifica se a URL do banner existe, se não, cai no placeholder
	const imageUrl = currentManga.bannerUrl
		? currentManga.bannerUrl
		: 'https://placehold.co/1920x800/1a1a1a/white.png?text=Sem+Imagem'

	return (
		<section className="relative w-full h-150 md:h-175 overflow-hidden bg-brand-black">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlide}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className="absolute inset-0"
				>
					{/* Background Image */}
					<div className="absolute inset-0">
						<Image
							src={imageUrl}
							alt={currentManga.title}
							fill
							priority={true} // Força a alta prioridade no Next.js
							loading="eager" // Diz ao Next.js para não usar lazy-loading aqui
							fetchPriority="high" // Grita para o navegador: "BAIXE ISSO PRIMEIRO!"
							sizes="100vw"
							className="object-cover"
							unoptimized={imageUrl.includes('localhost')}
						/>
						<div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
					</div>

					{/* Content */}
					<div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="max-w-2xl"
						>
							<div className="inline-block mb-4 px-4 py-1.5 bg-brand-primary text-white text-sm font-semibold tracking-wider rounded">
								DESTAQUE
							</div>
							<h1
								className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-none tracking-tight"
								style={{ letterSpacing: '-0.02em' }}
							>
								{currentManga.title}
							</h1>
							<p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl line-clamp-3">
								{/* CORREÇÃO: trocado .description por .synopsis */}
								{currentManga.synopsis ||
									'Nenhuma sinopse disponível para esta obra.'}
							</p>
							<Link href={`/mangas/${currentManga.id}`}>
								<Button
									size="lg"
									className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-8 py-6 text-lg transition-all duration-200 active:scale-[0.98]"
								>
									Ler agora
								</Button>
							</Link>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Navigation Arrows */}
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-200 z-10"
			>
				<ChevronLeft className="h-6 w-6" />
			</button>
			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-200 z-10"
			>
				<ChevronRight className="h-6 w-6" />
			</button>

			{/* Dot Indicators */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-10">
				{mangas.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-brand-primary w-8' : 'bg-white/40 hover:bg-white/60'}`}
					/>
				))}
			</div>
		</section>
	)
}
