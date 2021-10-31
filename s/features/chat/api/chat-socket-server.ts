
import {WebSocketServer} from "ws"
import {mockChatPolicy} from "../testing/mocks/mock-meta-and-policy.js"
import {makeChatServelet} from "./chat-servelet.js"

export function makeChatSocketServer() {
	const servelet = makeChatServelet({policy: mockChatPolicy})
	const wss = new WebSocketServer({server: undefined})
	wss.on("connection", async ws => {
		ws.on("message", msg => {
	
		})
		// await servelet.acceptConnection({})
	})
}
