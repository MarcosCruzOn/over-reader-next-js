import type { VolumeRepository, CreateVolumeDTO } from '../repositories/volumeRepository'

export class UpdateVolumeUseCase {
	constructor(private volumeRepository: VolumeRepository) {}

	async execute(id: number, data: Partial<CreateVolumeDTO>) {
		if (!id) {
			throw new Error('O ID do volume é obrigatório para atualização.')
		}

		const volume = await this.volumeRepository.update(id, data)

		if (!volume) {
			throw new Error('Volume não encontrado.')
		}

		return volume
	}
}
