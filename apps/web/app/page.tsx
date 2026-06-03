import Header from '../app/components/Header'
import Hero from '../app/components/Hero'
import LatestUpdatesSection from '../app/components/LatestUpdatesSection'
import SavedMangasSidebar from '../app/components/SavedMangasSidebar'
import { Manga } from '@workspace/types'

// 🔥 Importando a nossa central conectada à nuvem!
import { api } from '@/app/lib/api'

export default async function WebHomePage() {
	// Puxando os dados dinamicamente direto da API na AWS
	let mangas: Manga[] = []
	try {
		mangas = await api.getMangas()
	} catch (error) {
		console.error('Erro ao buscar a lista de mangás para a Home:', error)
	}

	// Separa os 5 primeiros mangás para o Banner Principal (Hero)
	const heroMangas = mangas.slice(0, 5)

	return (
		<div className="dark min-h-screen bg-brand-black text-white font-sans selection:bg-brand-primary selection:text-white">
			{/* 🧭 Navbar Premium */}
			<Header />

			{/* 🎆 Banner Rotativo (Passamos apenas os destaques) */}
			<Hero mangas={heroMangas} />

			{/* 📚 Corpo Principal da Página */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
				{/* Lado Esquerdo: Abas e Grid de Atualizações (Ocupa o maior espaço) */}
				<div className="flex-1 min-w-0">
					<LatestUpdatesSection />
				</div>

				{/* Lado Direito: Sidebar de Mangás Salvos (Esconde em telas de celular) */}
				<div className="w-80 shrink-0 hidden lg:block">
					<SavedMangasSidebar />
				</div>
			</main>

			{/* Rodapé Simples */}
			<footer className="border-t border-gray-900 bg-black py-12 text-center text-sm text-gray-600 mt-12">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
					<div className="text-2xl font-bold tracking-tight text-white/50">
						OVER<span className="font-light">READER</span>
					</div>
					<p>© {new Date().getFullYear()} OVER Reader. Todos os direitos reservados.</p>
				</div>
			</footer>
		</div>
	)
}
