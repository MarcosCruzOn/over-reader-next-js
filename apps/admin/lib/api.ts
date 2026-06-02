// Remove a barra final se existir, para evitar problemas de formatação nas URLs
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333').replace(/\/$/, '')

export const api = {
	getMangas: async () => {
		const res = await fetch(`${API_URL}/mangas`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar mangás')
		return await res.json()
	},

	getUsers: async () => {
		const res = await fetch(`${API_URL}/users`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar usuários')
		return await res.json()
	},

	updateUserStatus: async (userId: string, status: string) => {
		const res = await fetch(`${API_URL}/users/${userId}/status`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status }),
		})
		if (!res.ok) throw new Error('Falha ao atualizar status')
		return await res.json() // ou apenas return res.ok dependendo da sua API
	},
	createManga: async (mangaData: any) => {
		const res = await fetch(`${API_URL}/mangas`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(mangaData),
		})
		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}))
			throw new Error(errorData.error || `Erro no servidor: Status ${res.status}`)
		}
		return await res.json()
	},

	uploadMangaCover: async (mangaId: string, formData: FormData) => {
		const res = await fetch(`${API_URL}/mangas/${mangaId}/cover`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) throw new Error('Falha ao enviar capa para a AWS')
		return await res.json()
	},

	uploadMangaBanner: async (mangaId: string, formData: FormData) => {
		const res = await fetch(`${API_URL}/mangas/${mangaId}/banner`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) throw new Error('Falha ao enviar banner para a AWS')
		return await res.json()
	},

	getMangaById: async (mangaId: string | number) => {
		const res = await fetch(`${API_URL}/mangas/${mangaId}`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar os dados do mangá')
		return await res.json()
	},
	updateManga: async (mangaId: string | number, mangaData: any) => {
		const res = await fetch(`${API_URL}/mangas/${mangaId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(mangaData),
		})
		if (!res.ok) throw new Error('Falha ao atualizar os dados do mangá.')
		return await res.json()
	},

	createVolume: async (volumeData: any) => {
		const res = await fetch(`${API_URL}/volumes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(volumeData),
		})
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`Erro do servidor ao criar volume: ${errorText}`)
		}
		return await res.json()
	},

	getVolumeById: async (volumeId: string | number) => {
		const res = await fetch(`${API_URL}/volumes/${volumeId}`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar volume')
		return await res.json()
	},

	updateVolume: async (volumeId: string | number, volumeData: any) => {
		const res = await fetch(`${API_URL}/volumes/${volumeId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(volumeData),
		})
		if (!res.ok) throw new Error('Erro ao atualizar dados do volume.')
		return await res.json()
	},

	uploadVolumeCover: async (volumeId: string | number, formData: FormData) => {
		const res = await fetch(`${API_URL}/volumes/${volumeId}/cover`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`Volume criado, mas falhou ao enviar a capa: ${errorText}`)
		}
		return await res.json()
	},

	getVolumesByMangaId: async (mangaId: string | number) => {
		const res = await fetch(`${API_URL}/volumes/manga/${mangaId}`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar os volumes')
		return await res.json()
	},

	deleteVolume: async (volumeId: string | number) => {
		const res = await fetch(`${API_URL}/volumes/${volumeId}`, { method: 'DELETE' })
		if (!res.ok) throw new Error('Falha ao apagar o volume')
		return res
	},

	getChaptersByVolumeId: async (volumeId: string | number) => {
		const res = await fetch(`${API_URL}/chapters/volume/${volumeId}`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Falha ao buscar os capítulos')
		return await res.json()
	},

	createChapter: async (chapterData: any) => {
		const res = await fetch(`${API_URL}/chapters`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(chapterData),
		})
		if (!res.ok) {
			const errorText = await res.text()
			throw new Error(`Erro ao criar capítulo: ${errorText}`)
		}
		return await res.json()
	},

	uploadChapterPages: async (chapterId: string | number, formData: FormData) => {
		const res = await fetch(`${API_URL}/chapters/${chapterId}/pages`, {
			method: 'PATCH',
			body: formData,
		})
		if (!res.ok) throw new Error('Falha no upload das páginas para a AWS.')
		return await res.json()
	},

	deleteChapter: async (chapterId: string | number) => {
		const res = await fetch(`${API_URL}/chapters/${chapterId}`, { method: 'DELETE' })
		if (!res.ok) throw new Error('Falha ao apagar o capítulo')
		return res
	},

	getChapterById: async (chapterId: string | number) => {
		const res = await fetch(`${API_URL}/chapters/${chapterId}`, { cache: 'no-store' })
		if (!res.ok) throw new Error('Capítulo não encontrado')
		return await res.json()
	},

	updateChapter: async (chapterId: string | number, chapterData: any) => {
		const res = await fetch(`${API_URL}/chapters/${chapterId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(chapterData),
		})
		if (!res.ok) throw new Error('Erro ao atualizar dados do capítulo.')
		return await res.json()
	},
}
