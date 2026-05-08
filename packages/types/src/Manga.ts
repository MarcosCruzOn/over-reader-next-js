export interface Manga {
	id: number
	title: string
	author: string | null
	synopsis: string | null
	genres: string[] | null
	coverUrl: string | null
	bannerUrl: string | null
	status: string | null
	releaseYear: number | null
	createdAt: string
	updatedAt: string
}
