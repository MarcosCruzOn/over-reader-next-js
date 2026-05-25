import { Server as SocketIOServer } from 'socket.io'
import { Server as HttpServer } from 'http'

let io: SocketIOServer | null = null

// Mapeia o ID do utilizador da base de dados para o ID do canal do socket
const userSockets = new Map<string, string>()

export function initSocket(server: HttpServer) {
	io = new SocketIOServer(server, {
		cors: {
			origin: '*', // Pode substituir pelo endereço do seu frontend (ex: 'http://localhost:3000')
			methods: ['GET', 'POST'],
		},
	})

	io.on('connection', (socket) => {
		// O frontend envia o ID do utilizador logo após fazer a ligação
		socket.on('register', (userId: string) => {
			if (userId) {
				userSockets.set(userId, socket.id)
			}
		})

		socket.on('disconnect', () => {
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					userSockets.delete(userId)
					break
				}
			}
		})
	})

	return io
}

// Envia uma mensagem em tempo real apenas para um utilizador específico
export function sendNotificationToUser(userId: string, data: any) {
	if (!io) return
	const socketId = userSockets.get(userId)
	if (socketId) {
		io.to(socketId).emit('notification', data)
	}
}
