
import {WebSocketServer} from "ws"
import {makeChatServerCore} from "../cores/chat-server-core.js"

export function makeChatSocketServer({port, servelet}: {
		port: number
		servelet: ReturnType<typeof makeChatServerCore>
	}) {

	const server = new WebSocketServer({port})

	server.on("connection", async socket => {
		const chatClient = await servelet.acceptConnection({
			disconnect: () => socket.close(),
			sendDataToClient: async(...args: any[]) => socket.send(JSON.stringify(args)),
		})

		socket.on("message", data => {
			const args: [string, ...any[]] = JSON.parse(data.toString())
			console.log("message", ...args)
			chatClient.handleDataFromClient(...args)
		})

		socket.on("close", () => chatClient.handleDisconnect())
	})

	return {
		close() {
			server.close()
		},
	}
}
