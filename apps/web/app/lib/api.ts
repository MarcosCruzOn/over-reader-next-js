const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export const api = {
	// Busca a lista de mangás
	getMangas: async () => {
		const res = await fetch(`${API_URL}/mangas`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar mangás')
		return await res.json()
	},

	// Busca as páginas de um capítulo específico
	getChapterData: async (mangaId: string, chapterNumber: string) => {
		const res = await fetch(`${API_URL}/chapters/manga/${mangaId}/number/${chapterNumber}`, {
			cache: 'no-store',
		})
		if (!res.ok) return null
		return await res.json()
	},
}
