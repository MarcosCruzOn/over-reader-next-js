export interface Chapter {
	id: number
	mangaId: number
	volumeNumber: number | null
	chapterNumber: string
	title: string | null
	coverImageUrl: string | null
	bannerImageUrl: string | null
	pagesImageUrls: string[]
	createdAt: string
}
