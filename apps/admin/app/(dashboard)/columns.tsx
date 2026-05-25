'use client'

import { ColumnDef } from '@tanstack/react-table'

// Definimos o formato exato que o nosso backend devolve
export type User = {
	id: number
	name: string
	email: string
	role: string
	status: string
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Nome',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'role',
		header: 'Permissão',
		// Customizando a célula para deixar bonitinho
		cell: ({ row }) => {
			const role = row.getValue('role') as string
			return (
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
				>
					{role.toUpperCase()}
				</span>
			)
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.getValue('status') as string
			return (
				<span
					className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'ativo' ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}
				>
					{status.toUpperCase()}
				</span>
			)
		},
	},
]
