import Header from '@/app/components/Header'
import MangaGrid from '@/app/components/MangaGrid'
import { Manga } from '@workspace/types'

async function getMangas(query?: string): Promise<Manga[]> {
	const url = query
		? `http://localhost:3333/mangas?search=${query}`
		: 'http://localhost:3333/mangas'

	const res = await fetch(url, { cache: 'no-store' })
	return res.ok ? res.json() : []
}

export default async function MangasPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>
}) {
	const { q } = await searchParams
	const mangas = await getMangas(q)

	return (
		<div className="dark min-h-screen bg-background text-foreground">
			<Header />
			<main className="max-w-7xl mx-auto px-4 py-12">
				<h1 className="text-3xl font-black mb-8 uppercase">
					{q ? `Resultados para: ${q}` : 'Todos os Mangás'}
				</h1>
				<MangaGrid mangas={mangas} />
			</main>
		</div>
	)
}
