'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bookmark, MessageSquare, Star, Settings, Camera, LogOut } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import Image from 'next/image'

export default function PerfilPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('favorites')

	// Estados para guardar os dados vindos do backend
	const [favorites, setFavorites] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	// Proteção de Rota: Se não estiver logado, chuta para o login!
	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status, router])

	// Exemplo de como vamos buscar os favoritos (Ligue isso quando o backend estiver a rodar!)
	/*
	useEffect(() => {
		if (session?.user?.id && activeTab === 'favorites') {
			setIsLoading(true)
			// Lembre-se de ajustar a URL para a porta do seu backend (ex: 3333)
			fetch(`http://localhost:3333/favorites/user/${session.user.id}`)
				.then(res => res.json())
				.then(data => setFavorites(data))
				.finally(() => setIsLoading(false))
		}
	}, [session, activeTab])
	*/

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				Carregando o seu universo...
			</div>
		)
	}

	if (!session?.user) return null // Evita piscar a tela antes do redirecionamento

	return (
		<div className="min-h-screen bg-background text-foreground pb-20">
			{/* HEADER DO PERFIL (Banner e Foto) */}
			<div className="relative h-64 bg-muted overflow-hidden">
				{/* Banner Genérico (Poderíamos deixar o usuário trocar no futuro) */}
				<div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-purple-900/80" />
				<img
					src="https://placehold.co/1920x400/1a1a1a/333333.png?text=+"
					alt="Banner"
					className="w-full h-full object-cover mix-blend-overlay opacity-50"
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
				<div className="flex flex-col md:flex-row gap-8">
					{/* SIDEBAR (Cartão do Usuário) */}
					<div className="w-full md:w-80 shrink-0">
						<div className="bg-card border border-border rounded-xl p-6 shadow-2xl backdrop-blur-sm">
							<div className="relative w-32 h-32 mx-auto -mt-16 mb-4 group cursor-pointer">
								<img
									src={
										session.user.image ||
										'https://placehold.co/200x200/1a1a1a/white.png?text=U'
									}
									alt="Avatar"
									className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg"
									referrerPolicy="no-referrer"
								/>
								{/* Botão de trocar foto que aparece no Hover */}
								<div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<Camera className="w-8 h-8 text-white" />
								</div>
								{/* O Input de arquivo invisível (Vamos ligar a lógica de upload depois!) */}
								<input
									type="file"
									className="absolute inset-0 opacity-0 cursor-pointer"
									accept="image/*"
								/>
							</div>

							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-foreground">
									{session.user.name}
								</h1>
								<p className="text-muted-foreground text-sm">
									{session.user.email}
								</p>
								<div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
									Leitor Nvl. 1
								</div>
							</div>

							<div className="space-y-2">
								<Button
									variant={activeTab === 'favorites' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('favorites')}
								>
									<Bookmark className="w-5 h-5 mr-3" /> Favoritos
								</Button>
								<Button
									variant={activeTab === 'reviews' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('reviews')}
								>
									<Star className="w-5 h-5 mr-3" /> Minhas Avaliações
								</Button>
								<Button
									variant={activeTab === 'comments' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold"
									onClick={() => setActiveTab('comments')}
								>
									<MessageSquare className="w-5 h-5 mr-3" /> Comentários
								</Button>
								<div className="my-4 border-t border-border" />
								<Button
									variant={activeTab === 'settings' ? 'default' : 'ghost'}
									className="w-full justify-start font-semibold text-muted-foreground"
									onClick={() => setActiveTab('settings')}
								>
									<Settings className="w-5 h-5 mr-3" /> Configurações
								</Button>
								<Button
									variant="ghost"
									className="w-full justify-start font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10"
									onClick={() => signOut({ callbackUrl: '/' })}
								>
									<LogOut className="w-5 h-5 mr-3" /> Sair da conta
								</Button>
							</div>
						</div>
					</div>

					{/* ÁREA DE CONTEÚDO (Onde a mágica acontece) */}
					<div className="flex-1 mt-8 md:mt-0">
						{/* ABA: FAVORITOS */}
						{activeTab === 'favorites' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minha Biblioteca
								</h2>

								{/* Grid de placeholders (Para você ver como vai ficar) */}
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="group relative rounded-lg overflow-hidden border border-border bg-card aspect-[2/3] cursor-pointer"
										>
											<img
												src={`https://placehold.co/400x600/1a1a1a/444.png?text=Manga+${i}`}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												alt="Cover"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
												<h3 className="text-white font-bold truncate">
													Título do Mangá {i}
												</h3>
												<p className="text-primary text-sm font-semibold mt-1">
													Lendo Vol. 2
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* ABA: AVALIAÇÕES */}
						{activeTab === 'reviews' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Minhas Avaliações
								</h2>
								<div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
									<Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
									<p>Você ainda não avaliou nenhum mangá.</p>
								</div>
							</div>
						)}

						{/* ABA: CONFIGURAÇÕES */}
						{activeTab === 'settings' && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
								<h2 className="text-3xl font-black uppercase tracking-tight mb-6">
									Configurações
								</h2>
								<div className="bg-card border border-border rounded-xl p-6 space-y-6">
									<div className="space-y-2">
										<label className="text-sm font-bold text-muted-foreground uppercase">
											Nome de Exibição
										</label>
										<Input
											defaultValue={session.user.name || ''}
											className="bg-background border-border"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-bold text-muted-foreground uppercase">
											E-mail (Vinculado ao Google)
										</label>
										<Input
											defaultValue={session.user.email || ''}
											disabled
											className="bg-muted/50 cursor-not-allowed text-muted-foreground border-border"
										/>
									</div>
									<Button className="bg-primary text-white font-bold hover:bg-brand-dark">
										Salvar Alterações
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
