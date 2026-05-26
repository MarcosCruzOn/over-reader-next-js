'use client'

import React, { useState, useEffect } from 'react'
import {
	Users,
	Shield,
	Ban,
	CheckCircle,
	Loader2,
	UserCheck,
	MoreVertical,
	AlertCircle,
} from 'lucide-react'
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

	// 🔥 NOVO: Estado para controlar o filtro da tabela
	const [activeFilter, setActiveFilter] = useState<'ALL' | 'STAFF' | 'BANNED' | 'SUSPENDED'>(
		'ALL'
	)

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

	// 🔥 ATUALIZADO: Agora enviamos o status exato em vez de apenas alternar
	const handleStatusChange = async (
		userId: string,
		currentStatus: string,
		action: 'ATIVO' | 'BANIDO' | 'SUSPENSO'
	) => {
		const mensagens = {
			ATIVO: 'Deseja restaurar os privilégios deste usuário?',
			SUSPENSO:
				'Deseja SUSPENDER este usuário? Ele não poderá mais comentar ou curtir, mas continuará lendo.',
			BANIDO: 'Deseja BANIR este usuário? Ele perderá o acesso total à conta.',
		}

		if (!window.confirm(mensagens[action])) return

		try {
			const res = await fetch(`http://localhost:3333/users/${userId}/status`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: action }),
			})

			if (res.ok) {
				// Atualiza a tabela instantaneamente
				setUsers(users.map((u) => (u.id === userId ? { ...u, status: action } : u)))
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

	// 📊 Contadores com correção de Case Sensitivity
	const totalUsers = users.length
	const adminUsers = users.filter(
		(u) => u.role?.toUpperCase() === 'ADMIN' || u.role?.toUpperCase() === 'MODERADOR'
	).length
	const bannedUsers = users.filter((u) => u.status?.toUpperCase() === 'BANIDO').length
	const suspendedUsers = users.filter((u) => u.status?.toUpperCase() === 'SUSPENSO').length

	// 🔍 Lógica de Filtragem da Tabela
	const filteredUsers = users.filter((user) => {
		if (activeFilter === 'STAFF')
			return user.role?.toUpperCase() === 'ADMIN' || user.role?.toUpperCase() === 'MODERADOR'
		if (activeFilter === 'BANNED') return user.status?.toUpperCase() === 'BANIDO'
		if (activeFilter === 'SUSPENDED') return user.status?.toUpperCase() === 'SUSPENSO'
		return true // 'ALL'
	})

	return (
		<div className="max-w-6xl mx-auto w-full space-y-8">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Controle de Membros</h1>
				<p className="text-muted-foreground text-sm">
					Clique nos cards abaixo para filtrar a lista de usuários.
				</p>
			</div>

			{/* 🔥 CARDS CLICÁVEIS */}
			<div className="grid gap-4 md:grid-cols-4">
				<div
					onClick={() => setActiveFilter('ALL')}
					className={`bg-card border rounded-xl p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeFilter === 'ALL' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
				>
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Total de Leitores
						</p>
						<p className="text-2xl font-black mt-1">{totalUsers}</p>
					</div>
					<Users
						className={`w-8 h-8 ${activeFilter === 'ALL' ? 'text-primary' : 'text-muted-foreground opacity-40'}`}
					/>
				</div>

				<div
					onClick={() => setActiveFilter('STAFF')}
					className={`bg-card border rounded-xl p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeFilter === 'STAFF' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-border hover:border-blue-500/50'}`}
				>
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Equipe Staff
						</p>
						<p className="text-2xl font-black mt-1 text-blue-500">{adminUsers}</p>
					</div>
					<Shield
						className={`w-8 h-8 ${activeFilter === 'STAFF' ? 'text-blue-500' : 'text-blue-500 opacity-40'}`}
					/>
				</div>

				<div
					onClick={() => setActiveFilter('SUSPENDED')}
					className={`bg-card border rounded-xl p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeFilter === 'SUSPENDED' ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-border hover:border-yellow-500/50'}`}
				>
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Suspensos (Mute)
						</p>
						<p className="text-2xl font-black mt-1 text-yellow-500">{suspendedUsers}</p>
					</div>
					<AlertCircle
						className={`w-8 h-8 ${activeFilter === 'SUSPENDED' ? 'text-yellow-500' : 'text-yellow-500 opacity-40'}`}
					/>
				</div>

				<div
					onClick={() => setActiveFilter('BANNED')}
					className={`bg-card border rounded-xl p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${activeFilter === 'BANNED' ? 'border-red-500 ring-1 ring-red-500' : 'border-border hover:border-red-500/50'}`}
				>
					<div>
						<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
							Contas Banidas
						</p>
						<p className="text-2xl font-black mt-1 text-red-500">{bannedUsers}</p>
					</div>
					<Ban
						className={`w-8 h-8 ${activeFilter === 'BANNED' ? 'text-red-500' : 'text-red-500 opacity-40'}`}
					/>
				</div>
			</div>

			{/* Tabela Filtrada */}
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
							{filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="p-8 text-center text-muted-foreground font-medium"
									>
										Nenhum usuário encontrado para este filtro.
									</td>
								</tr>
							) : (
								filteredUsers.map((user) => {
									const isBanned = user.status?.toUpperCase() === 'BANIDO'
									const isSuspended = user.status?.toUpperCase() === 'SUSPENSO'
									const isActive = !isBanned && !isSuspended

									return (
										<tr
											key={user.id}
											className="hover:bg-muted/20 transition-colors"
										>
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

											<td className="p-4">
												<Badge
													variant={
														user.role?.toUpperCase() === 'ADMIN'
															? 'default'
															: 'outline'
													}
													className="font-bold uppercase tracking-wider text-[10px]"
												>
													{user.role || 'USER'}
												</Badge>
											</td>

											<td className="p-4">
												<div className="flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-tight">
													{isBanned && (
														<span className="text-red-500 flex items-center gap-1">
															<Ban className="w-3.5 h-3.5" /> Banido
														</span>
													)}
													{isSuspended && (
														<span className="text-yellow-500 flex items-center gap-1">
															<AlertCircle className="w-3.5 h-3.5" />{' '}
															Suspenso
														</span>
													)}
													{isActive && (
														<span className="text-green-500 flex items-center gap-1">
															<CheckCircle className="w-3.5 h-3.5" />{' '}
															Ativo
														</span>
													)}
												</div>
											</td>

											<td className="p-4 text-xs font-semibold text-muted-foreground">
												{user.createdAt
													? new Date(user.createdAt).toLocaleDateString(
															'pt-BR'
														)
													: '---'}
											</td>

											<td className="p-4 pr-6 text-right">
												<DropdownMenu>
													<DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground outline-none transition-colors cursor-pointer">
														<MoreVertical className="w-4 h-4" />
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="bg-card border-border text-foreground w-48"
													>
														<DropdownMenuGroup>
															<DropdownMenuLabel className="text-xs uppercase text-muted-foreground tracking-wider">
																Ações disciplinares
															</DropdownMenuLabel>
															<DropdownMenuSeparator className="bg-border" />

															{/* OPÇÃO DE SUSPENDER (MUTE) */}
															<DropdownMenuItem
																className="cursor-pointer font-bold text-xs uppercase tracking-wide focus:text-yellow-500 focus:bg-yellow-500/10"
																onClick={() =>
																	handleStatusChange(
																		user.id,
																		user.status,
																		isSuspended
																			? 'ATIVO'
																			: 'SUSPENSO'
																	)
																}
															>
																{isSuspended ? (
																	<>
																		<UserCheck className="w-4 h-4 mr-2 text-green-500" />{' '}
																		<span className="text-green-500">
																			Tirar Suspensão
																		</span>
																	</>
																) : (
																	<>
																		<AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />{' '}
																		<span className="text-yellow-500">
																			Suspender (Mute)
																		</span>
																	</>
																)}
															</DropdownMenuItem>

															{/* OPÇÃO DE BANIR (BLOCK) */}
															<DropdownMenuItem
																className="cursor-pointer font-bold text-xs uppercase tracking-wide focus:text-red-500 focus:bg-red-500/10"
																onClick={() =>
																	handleStatusChange(
																		user.id,
																		user.status,
																		isBanned
																			? 'ATIVO'
																			: 'BANIDO'
																	)
																}
															>
																{isBanned ? (
																	<>
																		<UserCheck className="w-4 h-4 mr-2 text-green-500" />{' '}
																		<span className="text-green-500">
																			Desbanir Conta
																		</span>
																	</>
																) : (
																	<>
																		<Ban className="w-4 h-4 mr-2 text-red-500" />{' '}
																		<span className="text-red-500">
																			Banir Usuário
																		</span>
																	</>
																)}
															</DropdownMenuItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
