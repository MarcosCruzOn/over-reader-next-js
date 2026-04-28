import type { Request, Response } from 'express'
import { VolumeRepository } from '../repositories/volumeRepository'
import { CreateVolumeUseCase } from '../useCases/createVolumeUseCase'

export class VolumeController {
	async create(req: Request, res: Response) {
		try {
			const repository = new VolumeRepository()
			const useCase = new CreateVolumeUseCase(repository)
			const volume = await useCase.execute(req.body)
			res.status(201).json(volume)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async listByManga(req: Request, res: Response) {
		const repository = new VolumeRepository()
		const volumes = await repository.findByManga(Number(req.params.mangaId))
		res.json(volumes)
	}
}
