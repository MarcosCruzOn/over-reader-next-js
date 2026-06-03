export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export const api = {
	// Busca a lista de mangás (usado na Home/Catálogo)
	getMangas: async () => {
		const res = await fetch(`${API_URL}/mangas`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar mangás')
		return await res.json()
	},

	// Busca os detalhes de UM mangá específico (usado na página de Detalhes)
	getManga: async (id: string) => {
		const res = await fetch(`${API_URL}/mangas/${id}`, { cache: 'no-store' })
		if (!res.ok) return null
		return await res.json()
	},

	// Busca a lista de capítulos de um mangá (usado na página de Detalhes)
	getMangaChapters: async (mangaId: string) => {
		const res = await fetch(`${API_URL}/chapters/manga/${mangaId}`, { cache: 'no-store' })
		if (!res.ok) return []
		return await res.json()
	},

	// Busca as páginas de um capítulo específico (usado no Leitor)
	getChapterData: async (mangaId: string, chapterNumber: string) => {
		const res = await fetch(`${API_URL}/chapters/manga/${mangaId}/number/${chapterNumber}`, {
			cache: 'no-store',
		})
		if (!res.ok) return null
		return await res.json()
	},

	// Busca os lançamentos recentes (usado na página New Releases)
	getNewReleases: async () => {
		try {
			const res = await fetch(`${API_URL}/mangas?sort=newest`, { cache: 'no-store' })
			if (!res.ok) return []
			return await res.json()
		} catch (error) {
			console.error('Erro ao buscar lançamentos:', error)
			return []
		}
	},

	// Busca os mangás mais populares (usado na página Populares)
	getPopularMangas: async () => {
		try {
			const res = await fetch(`${API_URL}/mangas?sort=popular`, { cache: 'no-store' })
			if (!res.ok) return []
			return await res.json()
		} catch (error) {
			console.error('Erro ao buscar mangás populares:', error)
			return []
		}
	},

	// 🔥 NOVAS ROTAS DO PERFIL DO USUÁRIO
	getUserFavorites: async (userId: string) => {
		const res = await fetch(`${API_URL}/favorites/user/${userId}`)
		if (!res.ok) throw new Error('Falha ao buscar favoritos')
		return await res.json()
	},
	getUserReviews: async (userId: string) => {
		const res = await fetch(`${API_URL}/reviews/user/${userId}`)
		if (!res.ok) throw new Error('Falha ao buscar avaliações')
		return await res.json()
	},
	getUserComments: async (userId: string) => {
		const res = await fetch(`${API_URL}/comments/user/${userId}`)
		if (!res.ok) throw new Error('Falha ao buscar comentários')
		return await res.json()
	},
	getUserNotifications: async (userId: string) => {
		const res = await fetch(`${API_URL}/notifications/user/${userId}`)
		if (!res.ok) throw new Error('Falha ao buscar notificações')
		return await res.json()
	},
	uploadUserAvatar: async (userId: string, formData: FormData) => {
		const res = await fetch(`${API_URL}/users/${userId}/avatar`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) throw new Error('Falha ao atualizar avatar')
		return await res.json()
	},
	uploadUserBanner: async (userId: string, formData: FormData) => {
		const res = await fetch(`${API_URL}/users/${userId}/banner`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) throw new Error('Falha ao atualizar banner')
		return await res.json()
	},

	// 🔥 ROTAS DE CAPÍTULOS FAVORITADOS (Marcadores de página)
	getUserFavoriteChapters: async (userId: string) => {
		try {
			const res = await fetch(`${API_URL}/favorite-chapters/user/${userId}`)
			if (!res.ok) return []
			return await res.json()
		} catch (error) {
			console.error('Erro ao buscar capítulos favoritos:', error)
			return []
		}
	},
	removeUserFavoriteChapter: async (userId: string, chapterId: number | string) => {
		const res = await fetch(`${API_URL}/favorite-chapters/${userId}/${chapterId}`, {
			method: 'DELETE',
		})
		if (!res.ok) throw new Error('Falha ao remover capítulo favorito')
		return res
	},
}
