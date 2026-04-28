import type { Request, Response } from 'express'
import { MangaRepository } from '../repositories/mangaRepository'
import { CreateMangaUseCase } from '../useCases/createMangaUseCase'
import { ListMangasUseCase } from '../useCases/listMangasUseCase'
import { UpdateMangaUseCase } from '../useCases/updateMangaUseCase'
import { DeleteMangaUseCase } from '../useCases/deleteMangaUseCase'

export class MangaController {
	async create(req: Request, res: Response) {
		try {
			const data = req.body

			// Montamos o "quebra-cabeça" das classes
			const repository = new MangaRepository()
			const useCase = new CreateMangaUseCase(repository)

			const manga = await useCase.execute(data)

			// Retorna status 201 (Created) e os dados do mangá
			res.status(201).json(manga)
		} catch (error: any) {
			// Se a regra de negócio barrar, devolvemos erro 400 (Bad Request)
			res.status(400).json({ error: error.message })
		}
	}

	async list(req: Request, res: Response) {
		const repository = new MangaRepository()
		const useCase = new ListMangasUseCase(repository)
		const mangas = await useCase.execute()
		res.json(mangas)
	}

	async update(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const data = req.body
			const repository = new MangaRepository()
			const useCase = new UpdateMangaUseCase(repository)
			const updatedManga = await useCase.execute(id, data)
			res.json(updatedManga)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const repository = new MangaRepository()
			const useCase = new DeleteMangaUseCase(repository)
			await useCase.execute(id)
			res.status(204).send() // 204 significa "Deletado com sucesso, sem conteúdo pra retornar"
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}
}
