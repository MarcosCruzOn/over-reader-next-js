'use client'

import React, { useState, useEffect } from 'react'
import { Flag, Trash2, CheckCircle, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { api } from '@/lib/api'

export default function AdminReportsPage() {
	const [reports, setReports] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)

	// Colocamos a função de busca DENTRO do useEffect
	useEffect(() => {
		const fetchReports = async () => {
			try {
				const data = await api.getPendingReports()
				setReports(data)
			} catch (error) {
				console.error('Erro ao buscar denúncias:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchReports()
	}, [])

	const handleResolve = async (reportId: number, action: 'dismiss' | 'delete') => {
// ... o resto do código continua igualzinho daqui para baixo!

	const handleResolve = async (reportId: number, action: 'dismiss' | 'delete') => {
		const confirmMsg =
			action === 'delete'
				? 'Tem a certeza que quer APAGAR este comentário? A ação não pode ser desfeita e todas as respostas também sumirão.'
				: 'Deseja ignorar esta denúncia e manter o comentário ativo?'

		if (!window.confirm(confirmMsg)) return

		try {
			// Substituído pela chamada da central
			const res = await api.resolveReport(reportId, action)

			if (res.ok) {
				setReports(reports.filter((r) => r.id !== reportId))
			}
		} catch (error) {
			console.error('Erro ao resolver denúncia:', error)
			alert('Falha ao comunicar com o servidor.')
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8">
			<div className="flex items-center gap-3 mb-8">
				<AlertTriangle className="w-8 h-8 text-primary" />
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Centro de Moderação</h1>
					<p className="text-muted-foreground text-sm">
						Analise as denúncias da comunidade e tome ações disciplinares.
					</p>
				</div>
			</div>

			{reports.length > 0 ? (
				<div className="space-y-4">
					{reports.map((report) => (
						<div
							key={report.id}
							className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6"
						>
							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-2">
									<Flag className="w-4 h-4 text-red-500" />
									<span className="text-xs font-bold text-red-500 uppercase tracking-widest">
										Denunciado por {report.reporter?.name || 'Usuário'}
									</span>
									<span className="text-xs text-muted-foreground ml-auto font-bold uppercase tracking-widest">
										{new Date(report.createdAt).toLocaleDateString('pt-BR')}
									</span>
								</div>

								<div className="bg-background p-4 rounded-lg border border-border shadow-inner">
									<p className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">
										Motivo Alegado:
									</p>
									<p className="text-sm text-foreground font-medium">
										{report.reason}
									</p>
								</div>

								<div className="pl-4 border-l-2 border-primary/30">
									<p className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest">
										Comentário Original:
									</p>
									<p className="text-sm text-foreground italic break-words whitespace-pre-wrap">
										"{report.comment?.text}"
									</p>
								</div>
							</div>

							<div className="flex md:flex-col gap-3 justify-center md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
								<Button
									onClick={() => handleResolve(report.id, 'delete')}
									className="flex-1 font-bold uppercase tracking-wider bg-brand-dark hover:bg-primary text-white"
								>
									<Trash2 className="w-4 h-4 mr-2" /> Apagar
								</Button>
								<Button
									onClick={() => handleResolve(report.id, 'dismiss')}
									variant="outline"
									className="flex-1 font-bold uppercase tracking-wider border-border hover:bg-muted text-foreground"
								>
									<CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Ignorar
								</Button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-background/50">
					<CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
					<p className="text-xl font-black text-foreground uppercase tracking-tight">
						Tudo limpo!
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						A comunidade está se comportando. Nenhuma denúncia pendente.
					</p>
				</div>
			)}
		</div>
	)
}
