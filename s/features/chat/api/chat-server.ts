
import json5 from "json5"
import * as renraku from "renraku"
import {webSocketServer} from "renraku/x/websocket/socket-server.js"

import {getRando} from "../../../toolbox/get-rando.js"
import {makeChatClientside} from "./services/chat-clientside.js"
import {makeChatServerCore} from "./cores/chat-server-core.js"
import {deathWithDignity} from "../../../toolbox/death-with-dignity.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {mockChatPersistence} from "./cores/persistence/mock-chat-persistence.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {assimilateCrypto} from "../../../assembly/backend/assimilators/assimilate-crypto.js"
import {configureTokenFunctions} from "../../../assembly/backend/configurators/configure-token-functions.js"

void async function main() {
	const {onDeath} = deathWithDignity()

	console.log("starting chat server...")

	const config = json5.parse<SecretConfig>(process.env.XIOME_CONFIG)
	const rando = await getRando()
	const storage = memoryFlexStorage()

	const crypto = assimilateCrypto({
		config,
		configureTokenFunctions,
	})

	const persistence = await mockChatPersistence(storage)

	const core = makeChatServerCore({
		rando,
		persistence,
		logError: error => console.error(error),
		policy: async({accessToken}) => ({
			access: await crypto.verifyToken(accessToken)
		}),
	})

	const server = webSocketServer({
		port: 8000,
		exposeErrors: true,
		maxPayloadSize: renraku.megabytes(1),
		acceptConnection({controls, prepareClientApi}) {
			const {api, disconnect} = core.acceptNewClient({
				clientside: prepareClientApi<ReturnType<typeof makeChatClientside>>({
					chatClient: async() => {},
				}),
				handleDisconnect: () => {},
			})
			return {
				api,
				handleConnectionClosed: disconnect,
			}
		},
	})

	onDeath(() => server.close())
}()
