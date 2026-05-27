import Link from 'next/link'
import { BookOpen, Users, Activity, Plus, Calendar } from 'lucide-react'

import { ChartAreaInteractive } from '@workspace/ui/components/chart-area-interactive'
import { DataTable } from '@workspace/ui/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'

import { columns } from './columns'

// Função que agrupa os registos e gera os dados do gráfico para os últimos 90 dias
function generateChartData(mangas: any[], users: any[]) {
	const dateMap = new Map<string, { date: string; mangas: number; users: number }>()

	for (let i = 89; i >= 0; i--) {
		const d = new Date()
		d.setDate(d.getDate() - i)
		const dateStr = d.toISOString().split('T')[0]!
		dateMap.set(dateStr, { date: dateStr, mangas: 0, users: 0 })
	}

	mangas.forEach((m) => {
		if (!m.createdAt) return
		const dateStr = new Date(m.createdAt).toISOString().split('T')[0]!
		if (dateMap.has(dateStr)) dateMap.get(dateStr)!.mangas += 1
	})

	users.forEach((u) => {
		if (!u.createdAt) return
		const dateStr = new Date(u.createdAt).toISOString().split('T')[0]!
		if (dateMap.has(dateStr)) dateMap.get(dateStr)!.users += 1
	})

	return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

async function getDashboardStats() {
	try {
		const [mangasRes, usersRes] = await Promise.all([
			fetch('http://localhost:3333/mangas', { cache: 'no-store' }),
			fetch('http://localhost:3333/users', { cache: 'no-store' }),
		])

		const mangas = await mangasRes.json()
		const users = await usersRes.json()

		// Ordena os últimos mangás adicionados por data de criação (mais recentes primeiro)
		const latestMangas = [...mangas]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5) // Mostra apenas os 5 mais recentes

		return {
			stats: {
				totalMangas: mangas.length || 0,
				totalUsers: users.length || 0,
				ativos: users.filter((u: any) => u.status?.toUpperCase() === 'ATIVO').length || 0,
			},
			usersList: users.slice(0, 5), // Limita a tabela inicial aos 5 utilizadores mais recentes para performance
			latestMangas,
			chartData: generateChartData(mangas, users),
		}
	} catch (error) {
		console.error('Erro ao buscar dados da API:', error)
		return {
			stats: { totalMangas: 0, totalUsers: 0, ativos: 0 },
			usersList: [],
			latestMangas: [],
			chartData: [],
		}
	}
}

export default async function Page() {
	const { stats, usersList, latestMangas, chartData } = await getDashboardStats()

	return (
		<div className="@container/main flex flex-1 flex-col gap-6">
			<div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
				{/* 1. SEÇÃO DE METRICAS (CARDS) */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 px-4 lg:px-6">
					<Card className="bg-card border-border shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
								Total de Mangás
							</CardTitle>
							<BookOpen className="h-4 w-4 text-primary" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-black text-foreground">
								{stats.totalMangas}
							</div>
						</CardContent>
					</Card>

					<Card className="bg-card border-border shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
								Total de Usuários
							</CardTitle>
							<Users className="h-4 w-4 text-blue-500" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-black text-foreground">
								{stats.totalUsers}
							</div>
						</CardContent>
					</Card>

					<Card className="bg-card border-border shadow-sm">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
								Leitores Ativos
							</CardTitle>
							<Activity className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-black text-foreground">
								{stats.ativos}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 2. SEÇÃO DO GRÁFICO INTERATIVO */}
				<div className="px-4 lg:px-6">
					<ChartAreaInteractive chartData={chartData} />
				</div>

				{/* 3. GRID INFERIOR COMPARTILHADO: UTILIZADORES VS MANGÁS */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
					{/* Coluna Esquerda: Utilizadores Recentes */}
					<Card className="bg-card border-border p-4 flex flex-col justify-between">
						<div>
							<h2 className="text-xl font-black tracking-tight mb-4 uppercase text-sm text-muted-foreground tracking-widest">
								Usuários Recentes
							</h2>
							<DataTable columns={columns} data={usersList} />
						</div>
						<div className="mt-4 pt-4 border-t border-border/50 text-right">
							<Link href="/users">
								<Button
									variant="link"
									className="text-xs font-bold uppercase tracking-wider text-primary"
								>
									Gerenciar Membros →
								</Button>
							</Link>
						</div>
					</Card>

					{/* Coluna Direita: Últimos Mangás Adicionados */}
					<Card className="bg-card border-border p-4 flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-black tracking-tight uppercase text-sm text-muted-foreground tracking-widest">
									Últimos Mangás
								</h2>
								<Link href="/mangas/new">
									<Button size="sm" className="h-8 text-xs font-bold">
										<Plus className="w-3.5 h-3.5 mr-1" /> Novo
									</Button>
								</Link>
							</div>

							<div className="space-y-4">
								{latestMangas.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-12">
										Nenhum mangá catalogado até ao momento.
									</p>
								) : (
									latestMangas.map((manga: any) => (
										<div
											key={manga.id}
											className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
										>
											<img
												src={
													manga.coverUrl ||
													'https://placehold.co/120x180/1a1a1a/white.png?text=Capa'
												}
												alt={manga.title}
												className="w-10 h-14 object-cover rounded bg-muted border border-border/50 shrink-0"
											/>
											<div className="flex-1 min-w-0">
												<h4 className="font-bold text-sm text-foreground truncate">
													{manga.title}
												</h4>
												<p className="text-xs text-muted-foreground truncate">
													Por: {manga.author}
												</p>
												<div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
													<Calendar className="w-3 h-3" />
													{manga.createdAt
														? new Date(
																manga.createdAt
															).toLocaleDateString('pt-BR')
														: '---'}
												</div>
											</div>
											<div>
												<Link href={`/mangas/${manga.id}/edit`}>
													<Button
														variant="outline"
														size="sm"
														className="text-xs font-semibold h-8"
													>
														Editar
													</Button>
												</Link>
											</div>
										</div>
									))
								)}
							</div>
						</div>
						<div className="mt-4 pt-4 border-t border-border/50 text-right">
							<Link href="/mangas">
								<Button
									variant="link"
									className="text-xs font-bold uppercase tracking-wider text-primary"
								>
									Ver Catálogo Completo →
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}
