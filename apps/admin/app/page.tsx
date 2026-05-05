import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { ChartAreaInteractive } from '@workspace/ui/components/chart-area-interactive'
import { DataTable } from '@workspace/ui/components/data-table'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { BookOpen, Users, Activity } from 'lucide-react'

// 1. Importamos as nossas colunas do Admin
import { columns } from './columns'

// 2. Não precisamos mais do import do data.json! Pode apagar o arquivo data.json da pasta app se quiser.

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
			// 3. Agora retornamos também a lista completa de usuários!
			usersList: users,
		}
	} catch (error) {
		console.error('Erro ao buscar dados da API:', error)
		return { stats: { totalMangas: 0, totalUsers: 0, ativos: 0 }, usersList: [] }
	}
}

export default async function Page() {
	// 4. Desestruturamos para pegar as stats e a lista de usuários
	const { stats, usersList } = await getDashboardStats()

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
								<div className="grid gap-4 md:grid-cols-3 px-4 lg:px-6">
									{/* ... Mantenha seus Cards exatamente como estavam aqui ... */}
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

								<div className="px-4 lg:px-6">
									<ChartAreaInteractive />
								</div>

								{/* 🚀 5. A mágica acontece aqui: Passamos as colunas e os dados reais! */}
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
