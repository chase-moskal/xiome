
import {WebSocketServer} from "ws"
import {makeChatServerCore} from "./cores/chat-server-core.js"
import {mockChatPolicy} from "../testing/mocks/mock-meta-and-policy.js"
import {mockChatPersistence} from "./persistance/mock-chat-persistence.js"

export function makeChatSocketServer() {
	const servelet = makeChatServerCore({
		policy: mockChatPolicy,
		persistence: mockChatPersistence(),
	})
	const wss = new WebSocketServer({server: undefined})
	wss.on("connection", async ws => {
		ws.on("message", msg => {
	
		})
		// await servelet.acceptConnection({})
	})
}
