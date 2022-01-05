
import {chatMockClient} from "./chat-mock-client.js"
import {getRando} from "../../../../toolbox/get-rando.js"
import {ChatConnect} from "../../common/types/chat-concepts.js"
import {makeChatServerCore} from "../cores/chat-server-core.js"
import {mockChatPolicy} from "../../testing/mocks/mock-chat-policy.js"
import {mockChatPersistence} from "../cores/persistence/mock-chat-persistence.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mongoChatPersistence} from "../cores/persistence/chat-persistence-mongo.js"

export async function chatMockClientEntirely(storage: FlexStorage):
		Promise<ChatConnect> {

	const serverCore = makeChatServerCore({
		rando: await getRando(),
		persistence: await mockChatPersistence(storage),
		policy: mockChatPolicy,
	})

	return chatMockClient(serverCore)
}
