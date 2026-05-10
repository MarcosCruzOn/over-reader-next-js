import type { Request, Response } from 'express'
import { ChapterRepository } from '../repositories/chapterRepository'
import { CreateChapterUseCase } from '../useCases/createChapterUseCase'
import { UpdateChapterPagesUseCase } from '../useCases/updateChapterPagesUseCase'
import { DeleteChapterUseCase } from '../useCases/deleteChapterUseCase'
import { UpdateChapterUseCase } from '../useCases/updateChapterUseCase'

export class ChapterController {
	async create(req: Request, res: Response) {
		try {
			const repository = new ChapterRepository()
			const useCase = new CreateChapterUseCase(repository)
			const chapter = await useCase.execute(req.body)
			res.status(201).json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async listByVolume(req: Request, res: Response) {
		const repository = new ChapterRepository()
		const chapters = await repository.findByVolume(Number(req.params.volumeId))
		res.json(chapters)
	}

	async uploadPages(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)

			// O multer com .array() coloca os arquivos na propriedade req.files (no plural!)
			const files = req.files as any[]

			if (!files || files.length === 0) {
				return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' })
			}

			// Extraímos apenas a propriedade 'location' (a URL do S3) de todos os arquivos
			const pagesUrls = files.map((file) => file.location)

			const repository = new ChapterRepository()
			const useCase = new UpdateChapterPagesUseCase(repository)

			const chapter = await useCase.execute(id, pagesUrls)

			res.json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const repository = new ChapterRepository()
			const useCase = new DeleteChapterUseCase(repository)

			await useCase.execute(id)

			// Retornamos 204 (No Content) que é o padrão REST perfeito para exclusões com sucesso
			res.status(204).send()
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const repository = new ChapterRepository()
			const chapter = await repository.findById(id)

			if (!chapter) return res.status(404).json({ error: 'Capítulo não encontrado' })

			res.json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	async update(req: Request, res: Response) {
		try {
			const id = Number(req.params.id)
			const repository = new ChapterRepository()
			const useCase = new UpdateChapterUseCase(repository)

			const chapter = await useCase.execute(id, req.body)
			res.json(chapter)
		} catch (error: any) {
			res.status(400).json({ error: error.message })
		}
	}

	// No seu ChapterController.ts
	async getByMangaAndNumber(req: Request, res: Response) {
		try {
			// Convertendo para número de forma segura
			const mangaId = Number(req.params.mangaId)
			const chapterNumber = Number(req.params.chapterNumber)

			// Instancia o repositório correto
			const repository = new ChapterRepository()

			// O Controller só delega a tarefa!
			const chapter = await repository.findByMangaAndNumber(mangaId, chapterNumber)

			if (!chapter) {
				return res.status(404).json({ error: 'Capítulo não encontrado' })
			}

			return res.json(chapter)
		} catch (error: any) {
			console.error(error)
			return res.status(500).json({ error: 'Erro ao buscar o capítulo' })
		}
	}
}
