import { VolumeRepository } from '../repositories/volumeRepository'

export class ListVolumesUseCase {
	constructor(private volumeRepository: VolumeRepository) {}

	async execute(mangaId: number) {
		if (!mangaId) {
			throw new Error('O ID do mangá é obrigatório para listar os volumes.')
		}
		return await this.volumeRepository.findByMangaId(mangaId)
	}
}
