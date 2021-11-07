
import {WebSocketServer} from "ws"
import {makeChatServerCore} from "./cores/chat-server-core.js"
import {mockChatPolicy} from "../testing/mocks/mock-meta-and-policy.js"
import {mockChatPersistence} from "./cores/persistence/mock-chat-persistence.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {getRando} from "../../../toolbox/get-rando.js"

export async function makeChatSocketServer() {
	const rando = await getRando()
	const servelet = makeChatServerCore({
		rando,
		persistence: await mockChatPersistence(memoryFlexStorage()),
		policy: mockChatPolicy,
	})
	const wss = new WebSocketServer({server: undefined})
	wss.on("connection", async ws => {
		ws.on("message", msg => {
	
		})
		// await servelet.acceptConnection({})
	})
}
