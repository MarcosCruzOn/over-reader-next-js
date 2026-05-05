import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { ChartAreaInteractive } from '@workspace/ui/components/chart-area-interactive'
import { DataTable } from '@workspace/ui/components/data-table'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { BookOpen, Users, Activity } from 'lucide-react'
import { columns } from './columns'

// Pega as listas e agrupa contando quantos cadastros ocorreram por dia
function generateChartData(mangas: any[], users: any[]) {
	const dateMap = new Map<string, { date: string; mangas: number; users: number }>()

	// FIX: Agora geramos os últimos 90 dias para o filtro "Últimos 3 meses" funcionar perfeitamente
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

		return {
			stats: {
				totalMangas: mangas.length || 0,
				totalUsers: users.length || 0,
				ativos: users.filter((u: any) => u.status === 'ativo').length || 0,
			},
			usersList: users,
			// Passamos os dados processados pelo nosso agrupador
			chartData: generateChartData(mangas, users),
		}
	} catch (error) {
		console.error('Erro ao buscar dados da API:', error)
		return { stats: { totalMangas: 0, totalUsers: 0, ativos: 0 }, usersList: [], chartData: [] }
	}
}

export default async function Page() {
	// Desestruturamos também o chartData
	const { stats, usersList, chartData } = await getDashboardStats()

	return (
		<div className="dark min-h-screen bg-background text-foreground">
			<SidebarProvider
				style={
					{
						'--sidebar-width': 'calc(var(--spacing) * 72)',
						'--header-height': 'calc(var(--spacing) * 12)',
					} as React.CSSProperties
				}
			>
				<AppSidebar variant="inset" />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col">
						<div className="@container/main flex flex-1 flex-col gap-2">
							<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
								{/* 1. SEÇÃO DE CARDS */}
								<div className="grid gap-4 md:grid-cols-3 px-4 lg:px-6">
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Total de Mangás
											</CardTitle>
											<BookOpen className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-primary">
												{stats.totalMangas}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Total de Usuários
											</CardTitle>
											<Users className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{stats.totalUsers}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium">
												Usuários Ativos
											</CardTitle>
											<Activity className="h-4 w-4 text-muted-foreground" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{stats.ativos}</div>
										</CardContent>
									</Card>
								</div>

								{/* 🚀 2. SEÇÃO DO GRÁFICO (AGORA COM DADOS REAIS!) */}
								<div className="px-4 lg:px-6">
									<ChartAreaInteractive chartData={chartData} />
								</div>

								{/* 3. SEÇÃO DA TABELA */}
								<div className="px-4 lg:px-6">
									<h2 className="text-xl font-bold mb-4">Usuários Recentes</h2>
									<DataTable columns={columns} data={usersList} />
								</div>
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
