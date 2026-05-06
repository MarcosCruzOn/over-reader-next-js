import type { Request, Response } from 'express'
import { VolumeRepository } from '../repositories/volumeRepository'
import { CreateVolumeUseCase } from '../useCases/createVolumeUseCase'
import { UpdateVolumeCoverUseCase } from '../useCases/updateVolumeCoverUseCase'
import { DeleteVolumeUseCase } from '../useCases/deleteVolumeUseCase'

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
	async updateCover(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const file = req.file as any

			if (!file) return res.status(400).json({ error: 'Nenhuma capa enviada.' })

			const repository = new VolumeRepository()
			const useCase = new UpdateVolumeCoverUseCase(repository)

			const volume = await useCase.execute(id, file.location)
			res.json(volume)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const repository = new VolumeRepository()
			const useCase = new DeleteVolumeUseCase(repository)

			await useCase.execute(id)
			res.status(204).send()
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
