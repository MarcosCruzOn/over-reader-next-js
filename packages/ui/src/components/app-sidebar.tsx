'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Library, LayoutDashboard, Settings, Users, LogOut, Flag } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@workspace/ui/components/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname()

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ name: 'Catálogo (Mangás)', href: '/mangas', icon: BookOpen },
		{ name: 'Usuários', href: '/users', icon: Users },
		{ name: 'Configurações', href: '/settings', icon: Settings },
		{ name: 'Denúncias', href: '/denuncias', icon: Flag },
	]

	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-b border-border/50 pb-4 pt-4 px-4">
				{/* NOSSA NOVA LOGO OVER READER */}
				<Link
					href="/"
					className="flex items-center gap-3 transition-opacity hover:opacity-80"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
						<Library className="h-6 w-6" />
					</div>
					<div className="flex flex-col">
						<span className="font-black text-xl leading-none tracking-tight">OVER</span>
						<span className="font-medium text-sm text-muted-foreground uppercase tracking-widest">
							Reader
						</span>
					</div>
				</Link>
			</SidebarHeader>
			<SidebarContent className="px-2 pt-4">
				<SidebarMenu>
					{navigation.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`)
						return (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton
									isActive={isActive}
									tooltip={item.name}
									className="h-10"
								>
									<Link href={item.href} className="flex items-center gap-3">
										<item.icon className="h-5 w-5" />
										<span className="font-medium">{item.name}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarFooter className="border-t border-border/50 p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
							<span className="text-xs font-bold">AD</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-semibold">Admin Master</span>
							<span className="text-xs text-muted-foreground">
								admin@overreader.com
							</span>
						</div>
					</div>

					{/* 🔥 BOTÃO DE LOGOUT AQUI */}
					<button
						onClick={() => {
							// Apaga o cookie definindo uma data de validade no passado
							document.cookie =
								'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
							// Força o recarregamento da página para limpar estados do React e acionar o Proxy
							window.location.href = '/login'
						}}
						className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
						title="Sair do sistema"
					>
						<LogOut className="h-5 w-5" />
					</button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
