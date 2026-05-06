// useCases/deleteVolumeUseCase.ts
import { VolumeRepository } from '../repositories/volumeRepository'

export class DeleteVolumeUseCase {
	constructor(private volumeRepository: VolumeRepository) {}
	async execute(id: number) {
		return await this.volumeRepository.delete(id)
	}
}
