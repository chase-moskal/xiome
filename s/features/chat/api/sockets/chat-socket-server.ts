
import {WebSocketServer} from "ws"
import {makeChatServerCore} from "../cores/chat-server-core.js"

export function makeChatSocketServer({port, servelet}: {
		port: number
		servelet: ReturnType<typeof makeChatServerCore>
	}) {

	const wss = new WebSocketServer({port})

	wss.on("connection", async ws => {
		const chatClient = await servelet.acceptConnection({
			disconnect: () => ws.close(),
			sendDataToClient: async(...args: any[]) => ws.send(JSON.stringify(args)),
		})

		ws.on("message", data => {
			const args: [string, ...any[]] = JSON.parse(data.toString())
			chatClient.handleDataFromClient(...args)
		})

		ws.on("close", () => chatClient.handleDisconnect())
	})

	return {
		close() {
			wss.close()
		},
	}
}
