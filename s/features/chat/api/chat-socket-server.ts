
import {WebSocketServer} from "ws"
import {makeChatServerCore} from "./cores/chat-server-core.js"
import {mockChatPolicy} from "../testing/mocks/mock-meta-and-policy.js"
import {mockChatPersistence} from "./cores/persistance/mock-chat-persistence.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"

export async function makeChatSocketServer() {
	const servelet = makeChatServerCore({
		policy: mockChatPolicy,
		persistence: await mockChatPersistence(memoryFlexStorage()),
	})
	const wss = new WebSocketServer({server: undefined})
	wss.on("connection", async ws => {
		ws.on("message", msg => {
	
		})
		// await servelet.acceptConnection({})
	})
}
