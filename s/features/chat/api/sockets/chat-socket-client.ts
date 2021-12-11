
import {prepareChatClientCore} from "../cores/chat-client-core.js"

export function chatSocketClient(link: string) {
	const {chatConnect} = prepareChatClientCore({
		async connectToServer({handleDataFromServer}) {
			const socket = await connectWebSocket(link)
			socket.onmessage = async event => {
				try {
					const [key, ...args] = JSON.parse(event.data)
					await handleDataFromServer(key, ...args)
				}
				catch (error) {
					console.error(error)
				}
			}
			return {
				async sendDataToServer(...args) {
					socket.send(JSON.stringify(args))
				},
				async disconnect() {
					socket.close()
				},
			}
		},
	})
	return chatConnect
}

async function connectWebSocket(link: string) {
	return new Promise<WebSocket>((resolve, reject) => {
		const socket = new WebSocket(link)
		socket.onopen = () => resolve(socket)
		socket.onerror = (err) => reject(err)
	})
}
