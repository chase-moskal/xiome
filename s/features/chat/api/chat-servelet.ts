
import {clientsideShape} from "./handlers/clientside-shape.js"
import {lingoHost, lingoRemote} from "../../../toolbox/lingo/lingo.js"
import {prepareServersideHandlers} from "./handlers/prepare-serverside-handlers.js"
import {ChatAuth, ChatMeta, ClientsideHandlers} from "../common/types/chat-concepts.js"

export function makeChatServelet({policy}: {
		policy: (meta: ChatMeta) => Promise<ChatAuth>
	}) {

	let clientCount = 0

	async function acceptConnection({meta, disconnect, sendDataToClient}: {
				meta: ChatMeta
				disconnect(): void
				sendDataToClient: (...args: any[]) => Promise<void>
			}) {

		let auth = await policy(meta)
		clientCount += 1

		const clientside = lingoRemote<ClientsideHandlers>({
			shape: clientsideShape,
			send: sendDataToClient,
		})
	
		return {
			handleDataFromClient: lingoHost(prepareServersideHandlers({
				clientside,
				database: undefined,
				getAuth: () => auth,
			})),
			handleDisconnect() {
				clientCount -= 1
				disconnect()
			},
		}
	}

	return {
		acceptConnection,
		getClientCount: () => clientCount,
	}
}
