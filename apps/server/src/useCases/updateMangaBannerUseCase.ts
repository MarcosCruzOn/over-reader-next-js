import { MangaRepository } from '../repositories/mangaRepository'

export class UpdateMangaBannerUseCase {
	constructor(private mangaRepository: MangaRepository) {}

	async execute(id: number, bannerUrl: string) {
		if (!bannerUrl) {
			throw new Error('A URL do banner é obrigatória.')
		}

		const manga = await this.mangaRepository.updateBanner(id, bannerUrl)

		if (!manga) {
			throw new Error('Mangá não encontrado.')
		}

		return manga
	}
}
