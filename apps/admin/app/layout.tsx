import '@workspace/ui/styles/globals.css'
import { AppSidebar } from '@workspace/ui/components/app-sidebar'
import { SiteHeader } from '@workspace/ui/components/site-header'
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import React from 'react'

export const metadata = {
	title: 'OverReader - Admin',
	description: 'Painel Administrativo do Over-Reader',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className="dark">
			<body className="min-h-screen bg-background text-foreground flex flex-col">
				{/* Movemos o Sidebar do Shadcn para o Layout Global! */}
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
						{/* Todo o conteúdo das páginas será injetado aqui dentro */}
						<main className="flex flex-1 flex-col">{children}</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	)
}
