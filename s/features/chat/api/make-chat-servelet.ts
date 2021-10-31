
import {Rando} from "../../../toolbox/get-rando.js"
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {prepareClientsideHandlers} from "./handlers/prepare-clientside-handlers.js"
import {prepareServersideHandlers} from "./handlers/prepare-serverside-handlers.js"
import {ChatAuth, ChatMeta} from "../common/types/chat-concepts.js"

export function makeChatServelet({rando, policy}: {
		rando: Rando
		policy: (meta: ChatMeta) => Promise<ChatAuth>
	}) {
	const clients = new Set<string>()

	async function acceptConnection({meta, sendDataToClient}: {
				meta: ChatMeta
				sendDataToClient: (...args: any[]) => Promise<void>
			}) {
		const auth = await policy(meta)
		const clientId = rando.randomId().toString()
		clients.add(clientId)
		return {
			handleDataFromClient: lingoHost(prepareServersideHandlers({
				auth,
				database: undefined,
				clientside: lingoRemote<ReturnType<typeof prepareClientsideHandlers>>({
					send: sendDataToClient,
					shape: {
						chatStateChange: true,
						populateNewMessages: true,
					},
				})
			})),
			handleDisconnect() {
				clients.delete(clientId)
			},
		}
	}

	return {
		acceptConnection,
		getClientCount: () => clients.size,
	}
}
