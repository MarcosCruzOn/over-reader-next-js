'use client'

import React, { useState, useEffect } from 'react'
import { Users, Shield, Ban, CheckCircle, Loader2, UserCheck, MoreVertical } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
} from '@workspace/ui/components/dropdown-menu'

export default function AdminUsersPage() {
	const [users, setUsers] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchUsers = async () => {
		try {
			const res = await fetch('http://localhost:3333/users')
			if (res.ok) {
				const data = await res.json()
				setUsers(data)
			}
		} catch (error) {
			console.error('Erro ao buscar usuários:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const handleStatusChange = async (userId: string, currentStatus: string) => {
		const nextStatus = currentStatus === 'ativo' ? 'banido' : 'ativo'
		const confirmMsg =
			nextStatus === 'banido'
				? 'Deseja realmente BANIR este usuário? Ele perderá acesso imediato às interações.'
				: 'Deseja revogar o banimento deste usuário?'

		if (!window.confirm(confirmMsg)) return

		try {
			// Integração com a rota correspondente ao changeUserStatusUseCase
			const res = await fetch(`http://localhost:3333/users/${userId}/status`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: nextStatus }),
			})

			if (res.ok) {
				setUsers(users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)))
			}
		} catch (error) {
			console.error('Erro ao atualizar status:', error)
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Loader2 className="w-10 h-10 animate-spin text-primary" />
			</div>
		)
	}

	// Contadores Inteligentes para os Cards de Resumo
	const totalUsers = users.length
	const adminUsers = users.filter((u) => u.role === 'admin' || u.role === 'moderador').length
	const bannedUsers = users.filter((u) => u.status === 'banido').length

	return (
		<div className="max-w-6xl mx-auto w-full space-y-8">
			{/* Topo informativo */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Controle de Membros</h1>
				<p className="text-muted-foreground text-sm">
					Gerencie privilégios administrativos e aplique sanções disciplinares.
				</p>
			</div>

			{/* Cards de Métricas Rápidas */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm">
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Total de Leitores
						</p>
						<p className="text-2xl font-black mt-1">{totalUsers}</p>
					</div>
					<Users className="w-8 h-8 text-muted-foreground opacity-40" />
				</div>
				<div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm">
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Equipe de Staff
						</p>
						<p className="text-2xl font-black mt-1 text-primary">{adminUsers}</p>
					</div>
					<Shield className="w-8 h-8 text-primary opacity-40" />
				</div>
				<div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm">
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Contas Banidas
						</p>
						<p className="text-2xl font-black mt-1 text-red-500">{bannedUsers}</p>
					</div>
					<Ban className="w-8 h-8 text-red-500 opacity-40" />
				</div>
			</div>

			{/* Tabela de Controle Customizada */}
			<div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
								<th className="p-4 pl-6">Membro</th>
								<th className="p-4">Cargo</th>
								<th className="p-4">Status</th>
								<th className="p-4">Cadastro</th>
								<th className="p-4 pr-6 text-right">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60 text-sm">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-muted/20 transition-colors">
									{/* Avatar e Informações básicas */}
									<td className="p-4 pl-6 flex items-center gap-3">
										<img
											src={
												user.image ||
												'https://placehold.co/80/1a1a1a/white.png?text=U'
											}
											alt={user.name || 'User'}
											className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
										/>
										<div className="flex flex-col min-w-0">
											<span className="font-bold text-foreground truncate max-w-[200px]">
												{user.name || 'Sem nome'}
											</span>
											<span className="text-xs text-muted-foreground truncate max-w-[200px]">
												{user.email}
											</span>
										</div>
									</td>

									{/* Cargo / Permissão */}
									<td className="p-4">
										<Badge
											variant={
												user.role === 'admin'
													? 'default'
													: user.role === 'moderador'
														? 'secondary'
														: 'outline'
											}
											className="font-bold uppercase tracking-wider text-[10px]"
										>
											{user.role || 'leitor'}
										</Badge>
									</td>

									{/* Status da Conta */}
									<td className="p-4">
										<div className="flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-tight">
											{user.status === 'banido' ? (
												<span className="text-red-500 flex items-center gap-1">
													<Ban className="w-3.5 h-3.5" /> Banido
												</span>
											) : (
												<span className="text-green-500 flex items-center gap-1">
													<CheckCircle className="w-3.5 h-3.5" /> Ativo
												</span>
											)}
										</div>
									</td>

									{/* Data de Criação */}
									<td className="p-4 text-xs font-semibold text-muted-foreground">
										{user.createdAt
											? new Date(user.createdAt).toLocaleDateString('pt-BR')
											: '---'}
									</td>

									{/* Menu de Ações Rápidas */}
									<td className="p-4 pr-6 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground outline-none transition-colors cursor-pointer">
												<MoreVertical className="w-4 h-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-card border-border text-foreground"
											>
												<DropdownMenuGroup>
													<DropdownMenuLabel className="text-xs uppercase text-muted-foreground tracking-wider">
														Ações disciplinares
													</DropdownMenuLabel>
													<DropdownMenuSeparator className="bg-border" />

													<DropdownMenuItem
														className={`cursor-pointer font-bold text-xs uppercase tracking-wide ${user.status === 'banido' ? 'text-green-500 focus:text-green-500 focus:bg-green-500/10' : 'text-red-500 focus:text-red-500 focus:bg-red-500/10'}`}
														onClick={() =>
															handleStatusChange(user.id, user.status)
														}
													>
														{user.status === 'BANIDO' ? (
															<>
																<UserCheck className="w-4 h-4 mr-2" />{' '}
																Desbanir Conta
															</>
														) : (
															<>
																<Ban className="w-4 h-4 mr-2" />{' '}
																Banir Usuário
															</>
														)}
													</DropdownMenuItem>
													<DropdownMenuItem
														className={`cursor-pointer font-bold text-xs uppercase tracking-wide ${user.status === 'banido' ? 'text-green-500 focus:text-green-500 focus:bg-green-500/10' : 'text-red-500 focus:text-red-500 focus:bg-red-500/10'}`}
														onClick={() =>
															handleStatusChange(user.id, user.status)
														}
													>
														{user.status === 'SUSPENSO' ? (
															<>
																<UserCheck className="w-4 h-4 mr-2" />{' '}
																Reativar Conta
															</>
														) : (
															<>
																<Ban className="w-4 h-4 mr-2" />{' '}
																Suspender Usuário
															</>
														)}
													</DropdownMenuItem>
												</DropdownMenuGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
