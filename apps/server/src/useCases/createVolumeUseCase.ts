import type { VolumeRepository, CreateVolumeDTO } from '../repositories/volumeRepository'

export class CreateVolumeUseCase {
	constructor(private volumeRepository: VolumeRepository) {}
	async execute(data: CreateVolumeDTO) {
		if (!data.mangaId || data.volumeNumber === undefined) {
			throw new Error('Manga ID e número do volume são obrigatórios.')
		}
		return await this.volumeRepository.create(data)
	}
}
