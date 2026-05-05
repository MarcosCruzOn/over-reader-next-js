'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	type ChartConfig,
} from '@workspace/ui/components/chart'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select'
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group'

export const description = 'An interactive area chart'

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
	const [timeRange, setTimeRange] = React.useState('90d')

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

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle>Total de visitantes</CardTitle>
				<CardDescription>
					<span className="hidden @[540px]/card:block">Crescimento da Plataforma</span>
					<span className="@[540px]/card:hidden">Últimos 3 meses</span>
				</CardDescription>
				<CardAction>
					<ToggleGroup
						multiple={false}
						value={timeRange ? [timeRange] : []}
						onValueChange={(value) => {
							setTimeRange(value[0] ?? '90d')
						}}
						variant="outline"
						className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
					>
						<ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
						<ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
						<ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
					</ToggleGroup>
					<Select
						value={timeRange}
						onValueChange={(value) => {
							if (value !== null) {
								setTimeRange(value)
							}
						}}
					>
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
					<AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
						{/* Restaurado: Os gradientes agora usam as nossas variáveis crimson! */}
						<defs>
							<linearGradient id="fillMangas" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-mangas)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-mangas)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-users)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-users)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>

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

						{/* FIX 1: Removido o stackId="a" para sobrepor em vez de somar */}
						{/* FIX 2: Alterado type para "linear" para acabar com a barriga negativa */}
						<Area
							dataKey="users"
							type="linear"
							fill="url(#fillUsers)"
							stroke="var(--color-users)"
						/>
						<Area
							dataKey="mangas"
							type="linear"
							fill="url(#fillMangas)"
							stroke="var(--color-mangas)"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
