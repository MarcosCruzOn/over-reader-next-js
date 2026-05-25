import '@workspace/ui/styles/globals.css'
import { TooltipProvider } from '@workspace/ui/components/tooltip'
import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata = {
	title: 'OverReader - Admin',
	description: 'Painel Administrativo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="pt-BR"
			className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full bg-background text-foreground flex flex-col">
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	)
}
