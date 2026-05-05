'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card'
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@workspace/ui/components/chart'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'

// FIX: Removemos o hsl() que estava quebrando o seu HEX #c41e3a
const chartConfig = {
	mangas: {
		label: 'Mangás',
		color: 'var(--chart-1)',
	},
	users: {
		label: 'Usuários',
		color: 'var(--chart-2)',
	},
} satisfies ChartConfig

interface ChartProps {
	chartData: {
		date: string
		mangas: number
		users: number
	}[]
}

export function ChartAreaInteractive({ chartData }: ChartProps) {
	// RESTAURADO: O estado do filtro de tempo
	const [timeRange, setTimeRange] = React.useState('90d')

	// RESTAURADO: A lógica que filtra os dados baseados na seleção
	const filteredData = React.useMemo(() => {
		const referenceDate = new Date()
		let daysToSubtract = 90

		if (timeRange === '30d') daysToSubtract = 30
		if (timeRange === '7d') daysToSubtract = 7

		const startDate = new Date(referenceDate)
		startDate.setDate(startDate.getDate() - daysToSubtract)

		return chartData.filter((item) => {
			const itemDate = new Date(item.date)
			return itemDate >= startDate
		})
	}, [chartData, timeRange])

	// Calcula os totais com base apenas nos dados filtrados
	const totalMangas = React.useMemo(
		() => filteredData.reduce((acc, curr) => acc + curr.mangas, 0),
		[filteredData]
	)
	const totalUsers = React.useMemo(
		() => filteredData.reduce((acc, curr) => acc + curr.users, 0),
		[filteredData]
	)

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>Crescimento da Plataforma</CardTitle>
					<CardDescription>Cadastros no período selecionado</CardDescription>
				</div>

				{/* RESTAURADO: O Dropdown de Filtro */}
				<CardAction>
					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">últimos 3 meses</ToggleGroupItem>
						<ToggleGroupItem value="30d">últimos 30 dias</ToggleGroupItem>
						<ToggleGroupItem value="7d">últimos 7 dias</ToggleGroupItem>
					</ToggleGroup>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger
							className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
							size="sm"
							aria-label="Select a value"
						>
							<SelectValue placeholder="Last 3 months" />
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value="90d" className="rounded-lg">
								Last 3 months
							</SelectItem>
							<SelectItem value="30d" className="rounded-lg">
								Last 30 days
							</SelectItem>
							<SelectItem value="7d" className="rounded-lg">
								Last 7 days
							</SelectItem>
						</SelectContent>
					</Select>
				</CardAction>
			</CardHeader>

			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
					{/* USANDO OS DADOS FILTRADOS */}
					<AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value)
								return date.toLocaleDateString('pt-BR', {
									month: 'short',
									day: 'numeric',
								})
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString('pt-BR', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										})
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="users"
							type="natural"
							fill="var(--color-users)"
							fillOpacity={0.4}
							stroke="var(--color-users)"
							stackId="a"
						/>
						<Area
							dataKey="mangas"
							type="natural"
							fill="var(--color-mangas)"
							fillOpacity={0.4}
							stroke="var(--color-mangas)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
