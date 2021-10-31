
import {ChatAuth, ChatMeta, ChatState} from "../common/types/chat-concepts.js"
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {prepareServersideHandlers} from "./handlers/prepare-serverside-handlers.js"
import {clientsideShape, prepareClientsideHandlers} from "./handlers/prepare-clientside-handlers.js"

export function makeChatServelet({policy}: {
		policy: (meta: ChatMeta) => Promise<ChatAuth>
	}) {

	let clientCount = 0
	let chatState: ChatState = ChatState.Online

	async function acceptConnection({meta, close, sendDataToClient}: {
				meta: ChatMeta
				close(): void
				sendDataToClient: (...args: any[]) => Promise<void>
			}) {
		const auth = await policy(meta)
		clientCount += 1
		const clientside = lingoRemote<ReturnType<typeof prepareClientsideHandlers>>({
			shape: clientsideShape,
			send: sendDataToClient,
		})
		await clientside.chatStateChange(chatState)
		return {
			handleDataFromClient: lingoHost(prepareServersideHandlers({
				auth,
				clientside,
				database: undefined,
			})),
			handleDisconnect() {
				clientCount -= 1
				close()
			},
		}
	}

	return {
		acceptConnection,
		getClientCount: () => clientCount,
	}
}
