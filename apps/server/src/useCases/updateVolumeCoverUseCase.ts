// useCases/updateVolumeCoverUseCase.ts
import { VolumeRepository } from '../repositories/volumeRepository'

export class UpdateVolumeCoverUseCase {
	constructor(private volumeRepository: VolumeRepository) {}
	async execute(id: number, coverUrl: string) {
		if (!coverUrl) throw new Error('A URL da capa é obrigatória.')
		return await this.volumeRepository.updateCover(id, coverUrl)
	}
}
