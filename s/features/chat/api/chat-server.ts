
import json5 from "json5"

import {getRando} from "../../../toolbox/get-rando.js"
import {makeChatServerCore} from "./cores/chat-server-core.js"
import {ChatAuth, ChatMeta} from "../common/types/chat-concepts.js"
import {makeChatSocketServer} from "./sockets/chat-socket-server.js"
import {deathWithDignity} from "../../../toolbox/death-with-dignity.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {mockChatPersistence} from "./cores/persistence/mock-chat-persistence.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {assimilateCrypto} from "../../../assembly/backend/assimilators/assimilate-crypto.js"
import {configureTokenFunctions} from "../../../assembly/backend/configurators/configure-token-functions.js"

void async function main() {
	deathWithDignity()
	console.log("starting chat server...")

	const config = json5.parse<SecretConfig>(process.env.XIOME_CONFIG)
	const rando = await getRando()
	const storage = memoryFlexStorage()

	const crypto = assimilateCrypto({
		config,
		configureTokenFunctions,
	})

	const servelet = makeChatServerCore({
		rando,
		persistence: await mockChatPersistence(storage),
		logError(error) {
			console.error(error)
		},
		async policy({accessToken}: ChatMeta): Promise<ChatAuth> {
			return {
				access: await crypto.verifyToken(accessToken)
			}
		},
	})

	makeChatSocketServer({servelet, port: 8000})
}()
